import { Link } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddressLink } from "./address-link";
import { formatTimestamp, formatGas } from "@/lib/utils";
import type { Block } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface BlocksTableProps {
  blocks: Block[];
  loading?: boolean;
}

export function BlocksTable({ blocks, loading }: BlocksTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px]">Block</TableHead>
            <TableHead className="w-[140px]">Age</TableHead>
            <TableHead>Miner</TableHead>
            <TableHead className="text-right w-[100px]">Txns</TableHead>
            <TableHead className="text-right w-[140px]">Gas Used</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blocks.map((block) => (
            <TableRow key={block.number} className="hover-elevate" data-testid={`row-block-${block.number}`}>
              <TableCell className="font-medium">
                <Link 
                  href={`/block/${block.number}`} 
                  className="text-primary hover:underline"
                  data-testid={`link-block-${block.number}`}
                >
                  {block.number}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatTimestamp(block.timestamp)}
              </TableCell>
              <TableCell>
                <AddressLink address={block.miner} />
              </TableCell>
              <TableCell className="text-right font-mono text-sm" data-testid={`text-txcount-${block.number}`}>
                {block.transactionCount}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                <div className="flex flex-col items-end">
                  <span>{formatGas(block.gasUsed)}</span>
                  <span className="text-xs text-muted-foreground">
                    {((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(1)}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
