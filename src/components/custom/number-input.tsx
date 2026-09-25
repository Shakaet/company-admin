type NumberInputProps = {
  value: number | string | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  allowDecimal?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
};

const NumberInput = ({
  value,
  onChange,
  placeholder,
  allowDecimal = false,
  className,
  min,
  max,
  step,
}: NumberInputProps) => {
  return (
    <input
      type="number"
      value={value ?? ""}
      placeholder={placeholder}
      className={`mt-1 h-10 w-full rounded-md border px-3 outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
      min={min}
      max={max}
      step={allowDecimal ? step || "any" : step || 1}
      onChange={(e) => {
        const val = e.target.value;

        if (val === "") {
          onChange(undefined);
          return;
        }

        const parsed = allowDecimal ? parseFloat(val) : parseInt(val, 10);

        if (!isNaN(parsed)) {
          onChange(parsed);
        }
      }}
    />
  );
};

export default NumberInput;
