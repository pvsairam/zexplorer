import { Link } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddressLink } from "./address-link";
import { StatusBadge } from "./status-badge";
import { EncryptedBadge } from "./encrypted-badge";
import { formatTimestamp, formatHash, formatValue } from "@/lib/utils";
import type { Transaction } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function TransactionsTable({ transactions, loading }: TransactionsTableProps) {
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
            <TableHead className="w-[180px]">Txn Hash</TableHead>
            <TableHead className="w-[120px]">Age</TableHead>
            <TableHead>From</TableHead>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>To</TableHead>
            <TableHead className="text-right w-[160px]">Value</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.hash} className="hover-elevate" data-testid={`row-tx-${tx.hash.slice(0, 10)}`}>
              <TableCell className="font-medium">
                <Link 
                  href={`/tx/${tx.hash}`} 
                  className="text-primary hover:underline font-mono text-sm"
                  data-testid={`link-tx-${tx.hash.slice(0, 10)}`}
                >
                  {formatHash(tx.hash, 8, 6)}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatTimestamp(tx.timestamp)}
              </TableCell>
              <TableCell>
                <AddressLink address={tx.from} />
              </TableCell>
              <TableCell>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </TableCell>
              <TableCell>
                {tx.to ? (
                  <AddressLink address={tx.to} />
                ) : (
                  <span className="text-muted-foreground text-sm">Contract Creation</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-sm">{formatValue(tx.value)}</span>
                  {tx.hasEncryptedData && (
                    <EncryptedBadge 
                      value={{ 
                        type: "euint64", 
                        handle: "0x" + tx.hash.slice(2, 18),
                        authorized: false 
                      }} 
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={tx.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
