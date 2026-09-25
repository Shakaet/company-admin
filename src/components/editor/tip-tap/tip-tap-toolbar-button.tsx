import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface TiptapToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  title?: string;
  className?: string;
  children: ReactNode;
}

export const TiptapToolbarButton = ({
  active = false,
  onClick,
  title,
  disabled = false,
  className,
  children,
  ...props
}: TiptapToolbarButtonProps) => {
  const button = (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none rounded-md p-1.5 text-sm outline-none transition-all duration-150",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );

  if (!title) return button;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* disabled button tooltip support wrapper */}
          <span className="inline-flex">{button}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface TiptapToolbarSeparatorProps {
  className?: string;
}

export const TiptapToolbarSeparator = ({
  className,
}: TiptapToolbarSeparatorProps) => (
  <div
    className={cn("mx-0.5 h-4 w-px shrink-0 self-center bg-border", className)}
  />
);
