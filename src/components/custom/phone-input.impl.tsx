import React from "react";
import type { FieldError } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string | FieldError;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const CustomInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full bg-transparent outline-none text-sm ${className || ""}`}
    />
  );
});

CustomInput.displayName = "CustomInput";

const PhonesInput = ({
  value = "+880",
  onChange,
  error,
  readOnly = false,
  disabled = false,
  placeholder = "01XXXXXXXXX",
  className = "",
}: PhoneInputProps) => {
  return (
    <div className="w-full">
      <div
        className={`flex items-center rounded-md border bg-white px-3 py-2 transition ${
          error
            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-200"
            : "border-gray-300 focus-within:ring-2 focus-within:ring-emerald-200 focus-within:border-emerald-500"
        } ${readOnly ? "bg-gray-100" : ""} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${className}`}
      >
        <PhoneInput
          international
          countryCallingCodeEditable={false}
          defaultCountry="BD"
          countries={["BD"]}
          value={value}
          onChange={(val) => {
            onChange?.(val || "+880");
          }}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full"
          inputComponent={CustomInput}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
    </div>
  );
};

export default PhonesInput;
