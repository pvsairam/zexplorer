import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/transactions-table";
import { AddressLink } from "@/components/address-link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { formatHash, formatGas, formatAbsoluteTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { Block, Transaction } from "@shared/schema";

export default function BlockDetail() {
  const [, params] = useRoute("/block/:number");
  const blockNumber = params?.number;
  const [copiedHash, setCopiedHash] = useState(false);

  const { data: block, isLoading: blockLoading } = useQuery<Block>({
    queryKey: ["/api/blocks", blockNumber],
    enabled: !!blockNumber,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/blocks", blockNumber, "transactions"],
    enabled: !!blockNumber,
  });

  const copyHash = () => {
    if (block?.hash) {
      navigator.clipboard.writeText(block.hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  if (blockLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Block Not Found</h1>
            <p className="text-muted-foreground">The requested block could not be found.</p>
            <Link href="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Block #{block.number}</h1>
          
          <div className="flex gap-2">
            <Link href={`/block/${block.number - 1}`}>
              <Button 
                variant="outline" 
                size="icon" 
                disabled={block.number === 0}
                data-testid="button-prev-block"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/block/${block.number + 1}`}>
              <Button variant="outline" size="icon" data-testid="button-next-block">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Block Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Block Hash
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm break-all" data-testid="text-block-hash">
                        {formatHash(block.hash, 12, 12)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={copyHash}
                      >
                        {copiedHash ? (
                          <Check className="h-3 w-3 text-success" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Parent Hash
                    </div>
                    <div className="font-mono text-sm break-all">
                      {formatHash(block.parentHash, 12, 12)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Timestamp
                    </div>
                    <div className="text-sm" data-testid="text-timestamp">
                      {formatAbsoluteTime(block.timestamp)}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Miner
                    </div>
                    <AddressLink address={block.miner} short={false} />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Gas Used / Limit
                    </div>
                    <div className="space-y-1">
                      <div className="font-mono text-sm" data-testid="text-gas-used">
                        {formatGas(block.gasUsed)} / {formatGas(block.gasLimit)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(2)}% utilized
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Transaction Count
                    </div>
                    <div className="font-mono text-sm" data-testid="text-transaction-count">
                      {block.transactionCount}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable 
                transactions={transactions || []} 
                loading={transactionsLoading} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
