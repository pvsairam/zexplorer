import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressLink } from "@/components/address-link";
import { StatusBadge } from "@/components/status-badge";
import { EncryptedBadge } from "@/components/encrypted-badge";
import { HandleDisplay } from "@/components/handle-display";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowRight } from "lucide-react";
import { formatHash, formatGas, formatValue, formatAbsoluteTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { Transaction } from "@shared/schema";

export default function TransactionDetail() {
  const [, params] = useRoute("/tx/:hash");
  const txHash = params?.hash;
  const [copiedHash, setCopiedHash] = useState(false);

  const { data: transaction, isLoading } = useQuery<Transaction>({
    queryKey: ["/api/transactions", txHash],
    enabled: !!txHash,
  });

  const copyHash = () => {
    if (transaction?.hash) {
      navigator.clipboard.writeText(transaction.hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Transaction Not Found</h1>
            <p className="text-muted-foreground">The requested transaction could not be found.</p>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Transaction Details</h1>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground" data-testid="text-tx-hash">
              {formatHash(transaction.hash, 16, 16)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </span>
                  <StatusBadge status={transaction.status} />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Block
                  </span>
                  <Link href={`/block/${transaction.blockNumber}`}>
                    <Button variant="ghost" className="h-auto p-0 font-mono text-primary hover:underline" data-testid="link-block">
                      {transaction.blockNumber}
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Timestamp
                  </span>
                  <span className="text-sm" data-testid="text-tx-timestamp">
                    {formatAbsoluteTime(transaction.timestamp)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Transaction Index
                  </span>
                  <span className="font-mono text-sm">
                    {transaction.transactionIndex}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    From
                  </div>
                  <AddressLink address={transaction.from} short={false} />
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground mt-6" />
                
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    To
                  </div>
                  {transaction.to ? (
                    <AddressLink address={transaction.to} short={false} />
                  ) : (
                    <span className="text-sm text-muted-foreground">Contract Creation</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Value
                    </div>
                    <div className="font-mono text-sm" data-testid="text-value">
                      {formatValue(transaction.value)}
                    </div>
                    {transaction.hasEncryptedData && (
                      <div className="mt-2">
                        <EncryptedBadge 
                          value={{ 
                            type: "euint64", 
                            handle: "0x" + transaction.hash.slice(2, 18),
                            authorized: false 
                          }} 
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Gas Price
                    </div>
                    <div className="font-mono text-sm">
                      {formatGas(transaction.gasPrice)} wei
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Nonce
                    </div>
                    <div className="font-mono text-sm">
                      {transaction.nonce}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Gas Limit
                    </div>
                    <div className="font-mono text-sm">
                      {formatGas(transaction.gas)}
                    </div>
                  </div>

                  {transaction.gasUsed !== null && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Gas Used
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono text-sm">
                          {formatGas(transaction.gasUsed)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {((Number(transaction.gasUsed) / Number(transaction.gas)) * 100).toFixed(2)}% of limit
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {transaction.hasEncryptedData && (
            <Card>
              <CardHeader>
                <CardTitle>Encrypted Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-encrypted/5 dark:bg-encrypted-dark/5 rounded-lg border border-encrypted/20">
                    <div>
                      <div className="text-sm font-medium mb-1">Ciphertext Handle</div>
                      <HandleDisplay handle={"0x" + transaction.hash.slice(2, 34)} />
                    </div>
                    <EncryptedBadge 
                      value={{ 
                        type: "euint64", 
                        handle: "0x" + transaction.hash.slice(2, 18),
                        authorized: false 
                      }} 
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    This transaction contains encrypted values. Only authorized addresses with proper ACL permissions can decrypt and view the actual values.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm break-all">
                {transaction.input}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
