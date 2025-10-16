import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status?: boolean | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === undefined || status === null) {
    return (
      <Badge variant="outline" className="gap-1 border-warning text-warning" data-testid="badge-status-pending">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  }

  if (status) {
    return (
      <Badge variant="outline" className="gap-1 border-success text-success" data-testid="badge-status-success">
        <CheckCircle2 className="h-3 w-3" />
        Success
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="gap-1" data-testid="badge-status-failed">
      <XCircle className="h-3 w-3" />
      Failed
    </Badge>
  );
}
