import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useEffect, useState } from "react";

type ImageGalleryPreviewProps = {
  images?: string[];
};

const ImageGalleryPreview = ({ images }: ImageGalleryPreviewProps) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-md border bg-muted text-muted-foreground">
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, images.length]);

  return (
    <>
      {/* TRIGGER (show first 3 + count) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 cursor-pointer"
      >
        {images.slice(0, 3).map((img, idx) => (
          <img
            key={idx}
            src={img}
            className="h-14 w-14 rounded-md object-cover border"
          />
        ))}

        {images.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{images.length - 3}
          </span>
        )}
      </button>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="rounded-xl bg-background shadow-xl overflow-hidden">
            {/* MAIN IMAGE */}
            <div className="relative flex items-center justify-center bg-muted/30 p-4">
              <img
                src={images[activeIndex]}
                className="max-h-[70vh] w-full object-contain rounded-lg"
              />

              {/* PREV */}
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow hover:scale-105 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* NEXT */}
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow hover:scale-105 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-2 overflow-x-auto p-3 border-t bg-muted/20">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-14 w-14 cursor-pointer rounded-md border object-cover transition ${
                    activeIndex === idx
                      ? "ring-2 ring-emerald-500"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGalleryPreview;
