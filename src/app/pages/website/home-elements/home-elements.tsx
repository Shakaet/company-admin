import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminPermission } from "@/helper/use-admin-permission";
import { Users, Code, Activity, Star, ThumbsUp } from "lucide-react";
import StatsTab from "./tabs/stats-tab";
import TechStackTab from "./tabs/tech-stack-tab";
import PartnersTab from "./tabs/partners-tab";
import TestimonialsTab from "./tabs/testimonials-tab";
import WhyChooseUsTab from "./tabs/why-choose-us-tab";

export default function HomeElementsPage() {
  const { can } = useAdminPermission();

  if (!can("home_show")) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground text-lg">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Home Elements</h1>
        <p className="text-slate-500 text-sm mt-1">Manage all dynamic sections of the home page</p>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 overflow-x-auto flex-nowrap rounded-lg border">
          <TabsTrigger value="stats" className="flex items-center gap-2 py-2.5 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Activity className="w-4 h-4" />
            <span className="whitespace-nowrap">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="tech-stack" className="flex items-center gap-2 py-2.5 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Code className="w-4 h-4" />
            <span className="whitespace-nowrap">Tech Stack</span>
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center gap-2 py-2.5 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="w-4 h-4" />
            <span className="whitespace-nowrap">Partners</span>
          </TabsTrigger>
          <TabsTrigger value="why-choose-us" className="flex items-center gap-2 py-2.5 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <ThumbsUp className="w-4 h-4" />
            <span className="whitespace-nowrap">Why Choose Us</span>
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-2 py-2.5 px-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Star className="w-4 h-4" />
            <span className="whitespace-nowrap">Testimonials</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="stats" className="m-0 border-none p-0 outline-none">
            <StatsTab />
          </TabsContent>
          <TabsContent value="tech-stack" className="m-0 border-none p-0 outline-none">
            <TechStackTab />
          </TabsContent>
          <TabsContent value="partners" className="m-0 border-none p-0 outline-none">
            <PartnersTab />
          </TabsContent>
          <TabsContent value="why-choose-us" className="m-0 border-none p-0 outline-none">
            <WhyChooseUsTab />
          </TabsContent>
          <TabsContent value="testimonials" className="m-0 border-none p-0 outline-none">
            <TestimonialsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
