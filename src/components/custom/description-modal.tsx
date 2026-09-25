"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PanelsTopLeft } from "lucide-react";
import { useState } from "react";

type DescriptionModalProps = {
  description?: string;
  title?: string;
};

const DescriptionModal = ({
  description,
  title = "Payment Note",
}: DescriptionModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Button inside modal */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PanelsTopLeft className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[60vw] w-full p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground whitespace-pre-line">
          {description || "No note available"}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionModal;
