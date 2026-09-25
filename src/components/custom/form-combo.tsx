import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

interface FormComboProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  rules?: any;
  multiple?: boolean;
  className?: string;
}

const FormCombo = <T extends FieldValues>({
  name,
  control,
  options,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  disabled = false,
  rules,
  multiple = false,
  className,
}: FormComboProps<T>) => {
  const [open, setOpen] = useState(false);

  // ✅ Normalize ANY incoming value (string | object | array)
  const normalizeValue = (val: any): string | string[] => {
    if (!val) return multiple ? [] : "";

    if (Array.isArray(val)) {
      return val.map((v) => (typeof v === "object" ? v.value : v));
    }

    return typeof val === "object" ? val.value : val;
  };

  // ✅ Get label safely
  const getLabel = (value: string) => {
    return options.find((o) => o.value === value)?.label || value;
  };

  const isSelected = (selected: string | string[], option: Option): boolean => {
    if (multiple) {
      return Array.isArray(selected) && selected.includes(option.value);
    }
    return selected === option.value;
  };

  const toggleOption = (
    current: string | string[],
    option: Option,
    onChange: (val: any) => void,
  ) => {
    if (multiple) {
      const arr = Array.isArray(current) ? current : [];
      const exists = arr.includes(option.value);

      if (exists) {
        onChange(arr.filter((v) => v !== option.value));
      } else {
        onChange([...arr, option.value]);
      }
    } else {
      onChange(option.value);
      setOpen(false);
    }
  };

  const removeSingle = (onChange: (val: any) => void) => {
    onChange("");
  };

  const removeMulti = (
    current: string | string[],
    value: string,
    onChange: (val: any) => void,
  ) => {
    const arr = Array.isArray(current) ? current : [];
    onChange(arr.filter((v) => v !== value));
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        const normalizedValue = normalizeValue(field.value);
        const selectedArray = Array.isArray(normalizedValue)
          ? normalizedValue
          : [];

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                disabled={disabled}
                className={cn(
                  "w-full min-h-10 justify-between",
                  className,
                  !normalizedValue || (multiple && selectedArray.length === 0)
                    ? "text-muted-foreground font-normal"
                    : "font-normal",
                )}
              >
                <div className="flex flex-wrap items-center gap-2 w-full">
                  {/* ✅ SINGLE */}
                  {!multiple ? (
                    normalizedValue ? (
                      <div className="flex items-center gap-2 rounded-md bg-muted text-sm px-2 py-1 capitalize">
                        <span>{getLabel(normalizedValue as string)}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSingle(field.onChange);
                          }}
                          className="cursor-pointer hover:bg-background rounded-sm p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ) : (
                      <span>{placeholder}</span>
                    )
                  ) : selectedArray.length > 0 ? (
                    /* ✅ MULTIPLE */
                    selectedArray.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-1 rounded-md bg-muted text-sm px-2 py-1 capitalize"
                      >
                        <span>{getLabel(item)}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMulti(normalizedValue, item, field.onChange);
                          }}
                          className="cursor-pointer hover:bg-background rounded-sm p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ))
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              className="w-[--radix-popover-trigger-width] p-0"
            >
              <Command>
                <CommandInput placeholder={searchPlaceholder} />
                <CommandEmpty>No option found.</CommandEmpty>

                <CommandGroup className="max-h-64 overflow-auto">
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() =>
                        toggleOption(normalizedValue, option, field.onChange)
                      }
                      className="capitalize"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(normalizedValue, option)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

export default FormCombo;
