import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import * as React from "react";

interface FileUploadProps {
  value?: File | File[] | null;
  onChange?: (file: File | File[] | null) => void;
  preview?: string | string[];
  className?: string;
  label?: string;
  description?: string;
  accept?: string;
  disabled?: boolean;
  error?: string;
  multiple?: boolean;
  previewClassName?: string;
}

const FileUpload = ({
  value,
  onChange,
  preview,
  className,
  label = "Banner Image",
  description = "PNG, JPG, WEBP up to 5MB",
  accept = "image/*",
  disabled = false,
  error,
  multiple = false,
  previewClassName,
}: FileUploadProps) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);

  const valueFiles = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const previewFiles = React.useMemo(() => {
    if (!preview) return [];
    return Array.isArray(preview) ? preview : [preview];
  }, [preview]);

  React.useEffect(() => {
    if (valueFiles.length === 0) {
      setPreviewUrls(previewFiles);
      return;
    }

    const objectUrls = valueFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [valueFiles, previewFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (multiple) {
      const existingFiles = Array.isArray(value) ? value : [];
      onChange?.([...existingFiles, ...files]);
    } else {
      onChange?.(files[0] || null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveSingle = () => {
    setPreviewUrls([]);
    onChange?.(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveMulti = (index: number) => {
    const updatedFiles = [...valueFiles];
    updatedFiles.splice(index, 1);

    const updatedPreviews = [...previewFiles];
    const hasRealFiles = valueFiles.length > 0;

    if (hasRealFiles) {
      onChange?.(updatedFiles);
    } else {
      updatedPreviews.splice(index, 1);
      onChange?.(updatedPreviews as unknown as File[]);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const hasPreview = previewUrls.length > 0;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      <Label className="text-sm font-medium">{label}</Label>

      <Card
        className={cn(
          "relative overflow-hidden border-dashed transition-all w-full!",
          "hover:border-primary/50 hover:bg-muted/30",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-60",
          error && "border-red-500 focus-within:ring-red-500",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />

        {/* SINGLE MODE */}
        {!multiple ? (
          !hasPreview ? (
            <div
              onClick={handleBrowseClick}
              className="flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center outline-none"
            >
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full border bg-muted",
                  error && "border-red-500 bg-red-50",
                )}
              >
                <UploadCloud
                  className={cn(
                    "h-6 w-6 text-muted-foreground",
                    error && "text-red-500",
                  )}
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          ) : (
            <div className="relative">
              <img
                src={previewUrls[0]}
                alt="Uploaded preview"
                className={cn("h-56 w-full object-cover", previewClassName)}
              />

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/70 to-transparent p-4">
                <div className="text-left text-white">
                  <p className="max-w-55 truncate text-sm font-medium">
                    {valueFiles[0]?.name || "Uploaded image"}
                  </p>
                  <p className="text-xs text-white/80">
                    {valueFiles[0]
                      ? `${(valueFiles[0].size / 1024 / 1024).toFixed(2)} MB`
                      : "Preview ready"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleBrowseClick}
                    disabled={disabled}
                  >
                    Replace
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={handleRemoveSingle}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        ) : (
          /* MULTI MODE */
          <div
            onClick={handleBrowseClick}
            className="flex w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center outline-none"
          >
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full border bg-muted",
                error && "border-red-500 bg-red-50",
              )}
            >
              <UploadCloud
                className={cn(
                  "h-6 w-6 text-muted-foreground",
                  error && "text-red-500",
                )}
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Click to upload images</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              {hasPreview ? "Add More Images" : "Choose Files"}
            </Button>
          </div>
        )}
      </Card>

      {/* MULTI PREVIEW GALLERY */}
      {multiple && previewUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {previewUrls.map((url, index) => {
            const file = valueFiles[index];

            return (
              <div
                key={`${url}-${index}`}
                className="group relative overflow-hidden rounded-xl border bg-muted"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className={cn("h-36 w-full object-cover", previewClassName)}
                />

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-2">
                  <p className="truncate text-xs font-medium text-white">
                    {file?.name || `Image ${index + 1}`}
                  </p>
                  <p className="text-[10px] text-white/80">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "Preview ready"}
                  </p>
                </div>

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2 h-8 w-8 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  onClick={() => handleRemoveMulti(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
