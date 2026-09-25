import { Suspense, lazy } from "react";

const PhonesInputImpl = lazy(() => import("./phone-input.impl"));

const PhonesInputWrapper = (props: any) => {
  return (
    <Suspense fallback={<div className="h-10 w-full bg-gray-50" />}>
      <PhonesInputImpl {...props} />
    </Suspense>
  );
};

export default PhonesInputWrapper;
