import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

const Field = ({
  label,
  labelInfo,
  required,
  error,
  children,
  full,
  className,
}: {
  label: string;
  labelInfo?: string;
  required?: boolean;
  error?: { message?: string };
  children: React.ReactNode;
  full?: boolean;
  className?: string;
}) => (
  <div
    className={cn(full ? "col-span-1 lg:col-span-2" : "col-span-1", className)}
  >
    <Label className={"mb-1.5"}>
      {label} {required && <span className="text-red-500">*</span>}{" "}
      {labelInfo && (
        <span className="text-[10px] font-normal">{labelInfo}</span>
      )}
    </Label>
    {children}
    {error && (
      <p className="text-sm text-red-500 mt-1">{error.message || "Required"}</p>
    )}
  </div>
);

export default Field;
