import { Input } from "@/components/ui/input";
import type {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormClearErrors,
  UseFormRegister,
} from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  placeholder?: string;
  type?: string;
  register?: UseFormRegister<T>;
  error?: FieldError;
  readOnly?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  clearErrors?: UseFormClearErrors<T>;
  className?: string;
   maxValue?: number;
};

const FormInput = <T extends FieldValues>({
  label,
  name,
  maxValue,
  placeholder,
  type = "text",
  register,
  error,
  readOnly = false,
  disabled = false,
  rules,
  clearErrors,
  className = "",
}: FormInputProps<T>) => {
  const registeredField = register?.(name, {
    ...rules,
  });

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="text-sm font-medium">{label}</label>

      <Input
        type={type}
        className="h-10 w-full"
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        {...registeredField}
        onChange={(e) => {
          registeredField?.onChange(e);

          if (e.target.value !== "") {
            clearErrors?.(name);
          }
        }}

         onBlur={(e) => {
          if (type === "number" && maxValue !== undefined) {
            const num = parseFloat(e.target.value);
            if (!isNaN(num) && num > maxValue) {
              e.target.value = String(maxValue);
              registeredField?.onChange(e);
            }
          }
          registeredField?.onBlur?.(e);
        }}
      />

      <div className="min-h-5">
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    </div>
  );
};

export default FormInput;
