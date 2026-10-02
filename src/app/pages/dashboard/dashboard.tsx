import { Sparkles, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="relative flex max-w-3xl flex-col items-center justify-center rounded-2xl border border-border bg-card/60 p-10 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl sm:p-16">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -z-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-12 -z-10 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Admin Portal</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to <span className="text-primary">Our Company</span> Website
        </h1>

        {/* Description */}
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          Manage your website services, portfolio projects, career opportunities,
          pricing plans, and dynamic content from one centralized panel.
        </p>

      </div>
    </div>
  );
}
