import { Skeleton } from "@/components/ui/skeleton";

const UpdateProductSkeleton = () => {
  return (
    <section>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Container */}
      <div className="mt-10 rounded-md border p-6 shadow-sm space-y-8">
        {/* BASIC INFO */}
        <div>
          <Skeleton className="h-5 w-40 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}

            {/* switches */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded-md px-3 h-10"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-10 rounded-full" />
              </div>
            ))}

            {/* main image */}
            <div className="col-span-2 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-48 w-full rounded-md" />
            </div>

            {/* variation toggle */}
            <div className="col-span-2">
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* PRICING / VARIATION */}
        <div>
          <Skeleton className="h-5 w-40 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* VARIATION TABLE */}
        <div>
          <Skeleton className="h-5 w-40 mb-4" />

          <div className="rounded-xl border overflow-hidden">
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-3">
                  {[...Array(6)].map((_, j) => (
                    <Skeleton key={j} className="h-10 w-full" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OTHER IMAGES */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>

          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-40 w-full rounded-md" />

          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>

        {/* BUTTON */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </section>
  );
};

export default UpdateProductSkeleton;
