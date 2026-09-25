import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";

const DeleteButton = ({
  onDelete,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item?",
  disabled = false,
}: {
  onDelete: () => Promise<void>;
  title?: string;
  description?: string;
  disabled?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const resetState = () => {
    setStatus("idle");
    setMessage("");
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      resetState();

      await onDelete();

      setStatus("success");
      setMessage("Deleted successfully");

      setTimeout(() => {
        setOpen(false);
        resetState();
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.message || "Failed to delete");
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          resetState();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="h-8 w-8"
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex justify-center">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                status === "success"
                  ? "bg-green-100"
                  : status === "error"
                    ? "bg-red-100"
                    : "bg-red-100"
              }`}
            >
              {status === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>

          <DialogTitle className="text-center">
            {status === "success"
              ? "Deleted"
              : status === "error"
                ? "Failed"
                : title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-sm text-muted-foreground">
          {status === "idle" ? description : message}
        </p>

        <DialogFooter className="flex gap-2 sm:justify-center">
          {status === "idle" && (
            <>
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                disabled={loading}
                onClick={handleDelete}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}

          {status !== "idle" && (
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetState();
              }}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
