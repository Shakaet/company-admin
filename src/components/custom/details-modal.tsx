"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PanelsTopLeft } from "lucide-react";
import React, { useState } from "react";

type OrderItem = {
  quantity?: number;
  price?: number;
  buying_price?: number;
  product_id?: {
    product_name_en?: string;
    product_sku?: string;
    product_unit_name?: string;
    product_image?: string;
    variation_name?: string;
  };
  variation_name?: string;
  attributes_details?: any[];
};

type DetailsModalProps = {
  items?: OrderItem[];
  title?: string;
  trigger?: React.ReactNode;
};

const DetailsModal = ({
  items = [],
  title = "Items Details",
  trigger,
}: DetailsModalProps) => {
  const [open, setOpen] = useState(false);

  const formatCurrency = (amount?: number) => {
    if (amount == null) return "৳0";
    return `৳${Number(amount).toLocaleString("en-US")}`;
  };

  const renderProductName = (item: OrderItem) => {
    const pid = item.product_id;
    if (!pid) return "N/A";
    const name = pid.product_name_en || (pid as any).product_name_bn || "N/A";

    const variation = item.variation_name || pid.variation_name || "";
    return variation ? `${name} — ${variation}` : name;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 flex items-center justify-center"
          >
            <PanelsTopLeft className="h-4 w-4" />{" "}
            <span className="mt-1">({items?.length || 0})</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] w-full p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {items?.length ? (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-border">
                  <TableHead className="w-12 text-center font-semibold">
                    #
                  </TableHead>

                  <TableHead className="font-semibold text-start">
                    Product
                  </TableHead>
                  <TableHead className="font-semibold">Unit</TableHead>
                  <TableHead className="font-semibold ">Price</TableHead>
                  <TableHead className="font-semibold ">Qty</TableHead>
                  <TableHead className="font-semibold ">Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="text-center">
                {items.map((it, i) => {
                  const qty = it.quantity || 0;
                  const price =
                    it.price || (it.product_id as any)?.product_price || 0;
                  const total = qty * price;
                  return (
                    <TableRow key={i} className="border-b last:border-0">
                      <TableCell className="text-center font-medium text-muted-foreground">
                        {i + 1}
                      </TableCell>

                      <TableCell className="text-left">
                        <div className="flex items-center gap-3">
                          <img
                            src={(it.product_id as any)?.product_image}
                            alt={
                              (it.product_id as any)?.product_name_en ||
                              "product"
                            }
                            className="h-10 w-10 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">
                              {renderProductName(it)}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="">
                        {(it.product_id as any)?.product_unit_name || "-"}
                      </TableCell>

                      <TableCell className=" font-medium">
                        {formatCurrency(price)}
                      </TableCell>

                      <TableCell className="font-medium">{qty}</TableCell>

                      <TableCell className=" font-semibold">
                        {formatCurrency(total)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No items found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailsModal;
