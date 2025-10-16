import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { CoprocessorStatus } from "@shared/schema";

interface CoprocessorStatusBadgeProps {
  status: CoprocessorStatus;
}

export function CoprocessorStatusBadge({ status }: CoprocessorStatusBadgeProps) {
  const getIcon = () => {
    switch (status.state) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "computing":
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />;
      case "failed":
        return <XCircle className="h-3 w-3" />;
    }
  };

  const getVariant = () => {
    switch (status.state) {
      case "pending":
        return "outline" as const;
      case "computing":
        return "default" as const;
      case "completed":
        return "outline" as const;
      case "failed":
        return "destructive" as const;
    }
  };

  const getColorClass = () => {
    switch (status.state) {
      case "pending":
        return "border-warning text-warning";
      case "computing":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "border-success text-success";
      case "failed":
        return "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={getVariant()} 
        className={`gap-1 ${getColorClass()}`}
        data-testid={`badge-coprocessor-${status.state}`}
      >
        {getIcon()}
        <span className="capitalize">{status.state}</span>
      </Badge>
      
      {status.state === "computing" && status.estimatedTime && (
        <span className="text-xs text-muted-foreground">
          ~{status.estimatedTime}s remaining
        </span>
      )}
    </div>
  );
}

interface CoprocessorProgressProps {
  status: CoprocessorStatus;
}

export function CoprocessorProgress({ status }: CoprocessorProgressProps) {
  const getProgress = () => {
    switch (status.state) {
      case "pending":
        return 0;
      case "computing":
        return 50;
      case "completed":
        return 100;
      case "failed":
        return 100;
    }
  };

  if (status.state === "completed" || status.state === "failed") {
    return null;
  }

  return (
    <div className="space-y-2">
      <Progress value={getProgress()} className="h-2" />
    </div>
  );
}
