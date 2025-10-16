import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, FileText, Users, Cpu } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { NetworkStats } from "@shared/schema";

interface NetworkStatsProps {
  stats: NetworkStats | null;
  loading?: boolean;
}

export function NetworkStats({ stats, loading }: NetworkStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Blocks",
      value: stats.totalBlocks.toLocaleString(),
      icon: Box,
      testId: "stat-blocks",
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions.toLocaleString(),
      icon: FileText,
      testId: "stat-transactions",
    },
    {
      title: "Active Addresses",
      value: stats.activeAddresses.toLocaleString(),
      icon: Users,
      testId: "stat-addresses",
    },
    {
      title: "Coprocessor Jobs",
      value: stats.coprocessorJobs.toLocaleString(),
      icon: Cpu,
      testId: "stat-coprocessor",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={stat.testId}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
