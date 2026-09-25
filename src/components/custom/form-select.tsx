import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormClearErrors,
} from "react-hook-form";
import { Controller } from "react-hook-form";

type SelectOption = {
  label: string;
  value: string;
};

type FormSelectProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  clearErrors?: UseFormClearErrors<T>;
};

const FormSelect = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  placeholder = "Select an option",
  error,
  disabled = false,
  rules,
  clearErrors,
}: FormSelectProps<T>) => {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium">{label}</label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              clearErrors?.(name);
            }}
            disabled={disabled}
          >
            <SelectTrigger className="h-10 w-full py-5!">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <div className="min-h-5">
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  );
};

export default FormSelect;
