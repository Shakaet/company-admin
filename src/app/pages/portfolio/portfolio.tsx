import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, FolderOpen, Star } from "lucide-react";
import PortfolioProjectsTab from "./tabs/portfolio-projects-tab";
import PortfolioCategoriesTab from "./tabs/portfolio-categories-tab";
import PortfolioHighlightsTab from "./tabs/portfolio-highlights-tab";
import Header from "@/components/custom/header";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <Header title="Portfolio Management" description="Manage projects, categories, and highlights" />

      <Tabs defaultValue="projects">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Layers className="w-4 h-4" /> Projects
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" /> Categories
          </TabsTrigger>
          <TabsTrigger value="highlights" className="flex items-center gap-2">
            <Star className="w-4 h-4" /> Highlights
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects"><PortfolioProjectsTab /></TabsContent>
        <TabsContent value="categories"><PortfolioCategoriesTab /></TabsContent>
        <TabsContent value="highlights"><PortfolioHighlightsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
