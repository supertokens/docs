import React from "react";

export type CompatibilitySelectOptionType = {
    id: string;
    displayName: string;
};

type CompatibilitySelectProps = {
    options: CompatibilitySelectOptionType[];
    setOption: (value: CompatibilitySelectOptionType) => void;
    selectedOption: CompatibilitySelectOptionType|undefined
    disabled?: boolean;
};

export default function CompatibilitySelect({ setOption, options, selectedOption, disabled = false }: CompatibilitySelectProps) {
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedOption = options.find(option => option.id === e.currentTarget.value)!;
        setOption(selectedOption);
    }
    return (
        <select disabled={disabled} className="select-container" onChange={handleChange} value={selectedOption?.id}>
            <option disabled={disabled}>Please select</option>
            {options.map(option => {
                return (
                    <option value={option.id} key={option.id}>
                        {option.displayName}
                    </option>
                );
            })}
        </select>
    );
}
