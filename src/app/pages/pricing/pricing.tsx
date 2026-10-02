import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Shield } from "lucide-react";
import PricingPlansTab from "./tabs/pricing-plans-tab";
import PricingGuaranteesTab from "./tabs/pricing-guarantees-tab";
import Header from "@/components/custom/header";

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <Header title="Pricing Management" description="Manage pricing plans and guarantee cards" />

      <Tabs defaultValue="plans">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Plans
          </TabsTrigger>
          <TabsTrigger value="guarantees" className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Guarantees
          </TabsTrigger>
        </TabsList>
        <TabsContent value="plans"><PricingPlansTab /></TabsContent>
        <TabsContent value="guarantees"><PricingGuaranteesTab /></TabsContent>
      </Tabs>
    </div>
  );
}
