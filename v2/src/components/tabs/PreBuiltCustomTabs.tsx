import React, {useState} from "react";

const preBuiltValue = "prebuilt";
const customUIValue = "customui";

export function PreBuiltCustomTabs(props: {
    children: any,
}) {
    const [selectedValue, setSelectedValue] = useState(preBuiltValue)

    const children = React.Children.map(props.children, child => {
        return React.cloneElement(child, {
            selectedValue,
        });
    });

    const onPreBuiltSelected = () => {
        setSelectedValue(preBuiltValue);
    }

    const onCustomSelected = () => {
        setSelectedValue(customUIValue)
    }   
    
    const headerTabs: {
        id: string,
        label: string,
        onClick: () => void,
    }[] = [{
        id: preBuiltValue,
        label: "Pre Built UI",
        onClick: onPreBuiltSelected,
    }, {
        id: customUIValue,
        label: "Custom UI",
        onClick: onCustomSelected,
    }]

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{
                position: "sticky",
                top: "var(--ifm-navbar-height)",
                width: "100%",
                height: "48px",
                boxSizing: "border-box",
                borderWidth: "1px",
                borderColor: "#ffffff",
                borderStyle: "solid",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                color: "#ffffff",
                fontWeight: "bold",
                overflow: "clip",
                backgroundColor: "var(--ifm-background-color)",
                zIndex: "9999999"
            }}>
                {
                    headerTabs.map(tab => {
                        const isSelected = tab.id === selectedValue;

                        return (
                            <div
                                style={{
                                flex: 1,
                                display: "flex",
                                cursor: isSelected ? "default" : "pointer",
                                height: "100%",
                                backgroundColor: isSelected ? "var(--ifm-color-primary)" : "transparent",
                            }}
                                key={tab.id}
                                onClick={tab.onClick}>
                                <span style={{
                                    margin: "auto",
                                }}>
                                    {tab.label}
                                </span>
                            </div>
                        );
                    })
                }
            </div>
            {children}
        </div>
    );
}

export function PreBuiltCustomTabChild(props: {
    value: typeof preBuiltValue | typeof customUIValue,
    selectedValue: string,
    children: any,
}) {
    const {value, selectedValue, children} = props;

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