import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { useEffect } from "react";

const STATUS_CONFIG = {
  success: {
    icon: Check,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700",
    border: "border-emerald-200",
    focus: "focus:ring-emerald-200",
    messageColor: "text-emerald-600",
  },
  error: {
    icon: X,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonBg: "bg-red-600 hover:bg-red-700",
    border: "border-red-200",
    focus: "focus:ring-red-200",
    messageColor: "text-red-500",
  },
};

export const modalState = {
  open: false,
  status: "success" as "success" | "error",
  title: "",
  message: "",
};

const StatusModal = ({
  open,
  status = "success",
  title,
  message,
  onClose,
}: {
  open: boolean;
  status?: "success" | "error";
  title: string;
  message?: string;
  onClose: () => void;
}) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-0 gap-0 border-0 overflow-hidden rounded-2xl shadow-xl">
        <DialogHeader className="pt-7 pb-6 px-6 text-center space-y-3">
          {/* Centered Icon Circle */}
          <div className="flex justify-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${config.iconBg} border-4 ${config.border} shadow-sm`}
            >
              <Icon className={`w-10 h-10 ${config.iconColor} stroke-[2.8]`} />
            </div>
          </div>

          {/* Title */}
          <DialogTitle className="text-2xl font-semibold text-foreground text-center">
            {title}
          </DialogTitle>

          {/* Message */}
          <DialogDescription
            className={`text-sm sm:text-base ${config.messageColor} text-center px-4 leading-relaxed`}
          >
            {message}
          </DialogDescription>
        </DialogHeader>

        {/* Button Section */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-center">
          <Button
            className={`px-10 text-white font-medium rounded-md shadow-sm transition-all duration-200 ${config.buttonBg} focus:ring-4 ${config.focus}`}
            onClick={onClose}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModal;
