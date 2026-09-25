import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

type ImagePreviewProps = {
  src?: string;
};

const fallback =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

const ImagePreview = ({ src }: ImagePreviewProps) => {
  const [open, setOpen] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (target.src !== fallback) {
      target.src = fallback;
    }
  };

  const imageSrc = src || fallback;

  return (
    <>
      {/* THUMBNAIL */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative h-14 w-14 overflow-hidden rounded-md border bg-muted transition-all hover:scale-[1.03] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
      >
        <img
          src={imageSrc}
          alt="Preview"
          onError={handleError}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </button>

      {/* PREVIEW MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[60%] border-none bg-transparent p-0 shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          <div className="overflow-hidden rounded-xl border bg-background shadow-2xl">
            <div className="flex items-center justify-center bg-muted/30 p-2 sm:p-4">
              <img
                src={imageSrc}
                alt="Preview Large"
                onError={handleError}
                className="max-h-[75vh] w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePreview;
