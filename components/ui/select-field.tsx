import { useId, type ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRootLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  className?: string;
  description?: string;
  disabled?: boolean;
  label: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  renderOption?: (option: SelectOption) => ReactNode;
  size?: "sm" | "default";
  value?: string;
}

export function SelectField({
  className,
  description,
  disabled,
  label,
  onValueChange,
  options,
  placeholder,
  renderOption,
  size,
  value,
}: SelectFieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;

  return (
    <div className={cn("st-select-field", className)}>
      <Select
        items={options}
        value={value || null}
        onValueChange={(nextValue) => {
          if (typeof nextValue === "string") onValueChange(nextValue);
        }}
        disabled={disabled}
      >
        <SelectRootLabel className="st-select-label">{label}</SelectRootLabel>
        {description && (
          <span id={descriptionId} className="st-select-description">
            {description}
          </span>
        )}
        <SelectTrigger aria-describedby={description ? descriptionId : undefined} size={size}>
          <SelectValue placeholder={placeholder}>
            {value && renderOption
              ? renderOption(options.find((option) => option.value === value) || { label: value, value })
              : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {renderOption ? renderOption(option) : option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
