import React, { useState } from "react";

export type CompatibilitySelectOptionType = {
    id: string;
    displayName: string;
};

type CompatibilitySelectProps = {
    options: CompatibilitySelectOptionType[];
    selectedOption: CompatibilitySelectOptionType | undefined;
    onOptionSelect: (value: CompatibilitySelectOptionType) => void;
    disabled?: boolean;
};

export default function CompatibilitySelect({
    onOptionSelect,
    options,
    selectedOption,
    disabled = false
}: CompatibilitySelectProps) {
    const [showOptions, setShowOptions] = useState(false);

    function openSelect() {
        if (disabled === false) {
            setShowOptions(true);
        }
    }

    return (
        <div
            className={`select-container ${disabled === true ? "disabled" : ""}`}
            onMouseLeave={() => setShowOptions(false)}
            onMouseEnter={() => openSelect()}
            //	this code make sure that the select options show up in the mobile view
            //	since there will be no onMouseEnter event there.
            onClick={() => openSelect()}
        >
            <div className="select-action">
                <span>{selectedOption !== undefined ? selectedOption.displayName : "Please select"} </span>
                <svg
                    style={{ rotate: showOptions && disabled === false ? "180deg" : undefined }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M14 8L10 12L6 8"
                        stroke="#AAAAAA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {showOptions ? (
                <div className="select-dropdown-wrapper">
                    <div className="select-dropdown">
                        {options.map(option => {
                            return (
                                <div
                                    className="select-item"
                                    key={option.id}
                                    onClick={e => {
                                        e.stopPropagation();
                                        onOptionSelect(option);
                                        setShowOptions(false);
                                    }}
                                >
                                    {option.displayName}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
