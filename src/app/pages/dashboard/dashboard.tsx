"use client";

import {
  useGetDashboard,
  type IDashboardSummary,
} from "@/api/dashboard/dashboard.api";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

import { format } from "date-fns";

import {
  Activity,
  BadgeDollarSign,
  CalendarIcon,
  Package,
  ShoppingCart,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";

import { useState } from "react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const statsConfig = [
  {
    key: "total_offer",
    label: "Total Offer",
    icon: BadgeDollarSign,
  },
  {
    key: "total_product",
    label: "Total Product",
    icon: Package,
  },
  {
    key: "total_order",
    label: "Total Order",
    icon: ShoppingCart,
  },
  {
    key: "pending_order",
    label: "Pending Order",
    icon: Activity,
  },
  {
    key: "processing_order",
    label: "Processing Order",
    icon: Activity,
  },
  {
    key: "shipped_order",
    label: "Shipped Order",
    icon: Truck,
  },
  {
    key: "delivered_order",
    label: "Delivered Order",
    icon: Wallet,
  },
  {
    key: "cancel_order",
    label: "Cancelled Order",
    icon: XCircle,
  },
  {
    key: "return_order",
    label: "Return Order",
    icon: Package,
  },
  {
    key: "today_order",
    label: "Today Order",
    icon: ShoppingCart,
  },
  {
    key: "weekly_order",
    label: "Weekly Order",
    icon: ShoppingCart,
  },
  {
    key: "monthly_order",
    label: "Monthly Order",
    icon: ShoppingCart,
  },
] as const;

const summaryCards = [
  {
    key: "total_revenue",
    label: "Total Revenue",
    isCurrency: true,
  },
  {
    key: "delivered_revenue",
    label: "Delivered Revenue",
    isCurrency: true,
  },
  {
    key: "total_order",
    label: "Total Orders",
    isCurrency: false,
  },
  {
    key: "delivered_order",
    label: "Delivered Orders",
    isCurrency: false,
  },
] as const;

const DashboardStatsBlock = ({
  title,
  description,
  summary,
}: {
  title: string;
  description: string;
  summary: IDashboardSummary;
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const value = summary[item.key];

          return (
            <Card
              key={item.key}
              className="overflow-hidden border-border/60 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>

                    <div className="rounded-lg border bg-muted/40 p-2">
                      <Wallet className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold tracking-tight">
                    {item.isCurrency
                      ? formatCurrency(Number(value))
                      : Number(value)}
                  </h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistics */}
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <CardTitle>Order Statistics</CardTitle>

          <CardDescription>Detailed analytics overview</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {statsConfig.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className="group rounded-2xl border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl border bg-muted/50 p-3 transition-all group-hover:bg-background">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-xs text-muted-foreground">
                      Overview
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>

                    <h4 className="mt-2 text-3xl font-bold tracking-tight">
                      {Number(summary[item.key])}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardLoading = () => {
  return (
    <div className="space-y-10">
      {[1, 2].map((item) => (
        <div key={item} className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-60" />
            <Skeleton className="h-4 w-80" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-2xl" />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();

  const [endDate, setEndDate] = useState<Date | undefined>();

  const [appliedRange, setAppliedRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const { data, isLoading, isFetching, error } = useGetDashboard(
    appliedRange,
    true,
  );

  const handleApply = () => {
    setAppliedRange({
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,

      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    });
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);

    setAppliedRange({});
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard Overview
        </h1>

        <p className="text-muted-foreground">
          Monitor revenue, orders and overall business performance.
        </p>
      </div>

      {/* Filter */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Filter Analytics</CardTitle>

          <CardDescription>Select custom start and end dates</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-11 w-full justify-start rounded-xl text-left font-normal",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Select start date</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto rounded-xl p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={2020}
                    toYear={2035}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-11 w-full justify-start rounded-xl text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Select end date</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto rounded-xl p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={2020}
                    toYear={2035}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                className="h-11 rounded-xl px-6"
                onClick={handleApply}
                disabled={isLoading || isFetching}
              >
                {isLoading || isFetching ? "Loading..." : "Apply Filter"}
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-xl px-6"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {(isLoading || isFetching) && <DashboardLoading />}

      {/* Error */}
      {!isLoading && error && (
        <Card className="border-destructive/30">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              {(error as { message?: string })?.message ||
                "Failed to load dashboard data"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Data */}
      {!isLoading && data?.data && (
        <div className="space-y-12">
          <DashboardStatsBlock
            title="Admin Dashboard"
            description="Analytics from admin owned activities"
            summary={data.data.admin}
          />

          <DashboardStatsBlock
            title="Merchant Dashboard"
            description="Analytics from merchant owned activities"
            summary={data.data.merchant}
          />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
