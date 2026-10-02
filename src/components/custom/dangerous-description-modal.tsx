export interface IProduct {
  product_name_en?: string;
  product_description_en?: string;
  product_description_bn?: string;
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DangerousDescriptionModal = ({
  open,
  setOpen,
  product,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  product: IProduct | null;
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[50%] w-full p-0 overflow-hidden rounded-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-muted/50">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {product.product_name_en}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* EN Card */}
          {product.product_description_en && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="px-5 py-3 border-b bg-muted/40">
                <h4 className="text-sm font-medium">Description (EN)</h4>
              </div>

              <div
                className="p-5 prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: product.product_description_en || "",
                }}
              />
            </div>
          )}

          {/* BN Card */}
          {product.product_description_bn && (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="px-5 py-3 border-b bg-muted/40">
                <h4 className="text-sm font-medium">Description (BN)</h4>
              </div>

              <div
                className="p-5 prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: product.product_description_bn || "",
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DangerousDescriptionModal;
