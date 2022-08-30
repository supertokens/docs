import React, { useEffect, useState } from "react";

const preBuiltValue = "prebuilt";
const customUIValue = "custom";
const uiStorageKey = "ui";

export function getUIModeFromStorage(): typeof preBuiltValue | typeof customUIValue {
    let uiFromStorage = window.localStorage.getItem(uiStorageKey);

    if (uiFromStorage === null || (uiFromStorage !== preBuiltValue && uiFromStorage !== customUIValue)) {
        uiFromStorage = customUIValue;
        window.localStorage.setItem(uiStorageKey, uiFromStorage);
    }

    return uiFromStorage as any;
}

export function updateUIMode(value: typeof preBuiltValue | typeof customUIValue) {
    window.localStorage.setItem(uiStorageKey, value);
    window.dispatchEvent(new Event("uiModeChanged"));
}

export function PreBuiltOrCustomUISwitcher(props: any) {
    let [uiMode, setUIMode] = useState(getUIModeFromStorage());

    const children = React.Children.map(props.children, child => {
        return React.cloneElement(child, {
            selectedValue: uiMode,
        });
    });

    const onUIModeChanged = () => {
        setUIMode(getUIModeFromStorage());
    }

    useEffect(() => {
        window.addEventListener("uiModeChanged", onUIModeChanged);
        return () => {
            window.removeEventListener("uiModeChanged", onUIModeChanged);
        }
    }, [])

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}>
            {children}
        </div>
    );
}

export function PreBuiltUIContent(props: any) {
    return <PreBuiltCustomUITabChild value={preBuiltValue} {...props} />;
}

export function CustomUIContent(props: any) {
    return <PreBuiltCustomUITabChild value={customUIValue} {...props} />;
}

function PreBuiltCustomUITabChild(props: {
    value: typeof preBuiltValue | typeof customUIValue,
    selectedValue: string,
    children: any,
}) {
    const { value, selectedValue, children } = props;

    if (value !== selectedValue) {
        return null;
    }

    return (
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            {children}
        </div>
    );
}