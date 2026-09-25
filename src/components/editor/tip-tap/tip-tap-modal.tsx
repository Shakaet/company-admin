import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { KeyboardEvent } from "react";
import { useEffect, useState } from "react";

interface TiptapLinkDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string, newTab: boolean) => void;
  initialUrl?: string;
}

export const TiptapLinkDialog = ({
  open,
  onClose,
  onConfirm,
  initialUrl = "",
}: TiptapLinkDialogProps) => {
  const [url, setUrl] = useState<string>("");
  const [newTab, setNewTab] = useState<boolean>(true);

  useEffect(() => {
    if (open) {
      setUrl(initialUrl || "");
      setNewTab(true);
    }
  }, [open, initialUrl]);

  const handleConfirm = () => {
    onConfirm(url.trim(), newTab);
    onClose();
  };

  const handleRemove = () => {
    onConfirm("", false);
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-5 pt-5 pb-4">
          <DialogTitle className="text-base">
            {initialUrl ? "Edit Link" : "Insert Link"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5 py-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tiptap-link-url">URL</Label>
            <Input
              id="tiptap-link-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          {/* Open in new tab */}
          <div className="flex items-center gap-2">
            <input
              id="tiptap-link-newtab"
              type="checkbox"
              checked={newTab}
              onChange={(e) => setNewTab(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-input accent-primary"
            />
            <Label
              htmlFor="tiptap-link-newtab"
              className="cursor-pointer font-normal"
            >
              Open in new tab
            </Label>
          </div>
        </div>

        <DialogFooter className="flex items-center gap-2 border-t bg-muted/20 px-5 py-3">
          {initialUrl && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="mr-auto"
            >
              Remove
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button size="sm" onClick={handleConfirm} disabled={!url.trim()}>
            {initialUrl ? "Update" : "Insert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
