import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Users } from "lucide-react";
import CareerJobsTab from "./tabs/career-jobs-tab";
import CareerApplicationsTab from "./tabs/career-applications-tab";
import Header from "@/components/custom/header";

export default function CareerPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Career Management"
        description="Manage job posts and review applications"
      />

      <Tabs defaultValue="jobs">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Job Posts
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <CareerJobsTab />
        </TabsContent>
        <TabsContent value="applications">
          <CareerApplicationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
