import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/transactions-table";
import { EncryptedBadge } from "@/components/encrypted-badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Wallet } from "lucide-react";
import { formatHash, formatValue } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { Transaction, AddressSummary } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AddressDetail() {
  const [, params] = useRoute("/address/:address");
  const address = params?.address;
  const [copiedAddress, setCopiedAddress] = useState(false);

  const { data: summary, isLoading: summaryLoading } = useQuery<AddressSummary>({
    queryKey: ["/api/addresses", address, "summary"],
    enabled: !!address,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/addresses", address, "transactions"],
    enabled: !!address,
  });

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  if (summaryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-96 mb-6" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!summary || !address) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Address Not Found</h1>
            <p className="text-muted-foreground">The requested address could not be found.</p>
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
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Address</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground" data-testid="text-address">
              {formatHash(address, 20, 20)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyAddress}
              data-testid="button-copy-address"
            >
              {copiedAddress ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Balance
                  </div>
                  <div className="space-y-2">
                    <div className="font-mono text-lg" data-testid="text-balance">
                      {formatValue(summary.balance)}
                    </div>
                    {summary.hasEncryptedBalance && (
                      <div className="flex items-center gap-2">
                        <EncryptedBadge 
                          value={{ 
                            type: "euint64", 
                            handle: "0x" + address.slice(2, 18),
                            authorized: false 
                          }} 
                        />
                        <span className="text-xs text-muted-foreground">
                          Encrypted balance available
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Transaction Count
                  </div>
                  <div className="font-mono text-lg" data-testid="text-tx-count">
                    {summary.transactionCount.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transactions">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="transactions" data-testid="tab-transactions">
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="tokens" data-testid="tab-tokens">
                    Tokens
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="transactions" className="mt-6">
                  <TransactionsTable 
                    transactions={transactions || []} 
                    loading={transactionsLoading} 
                  />
                </TabsContent>
                
                <TabsContent value="tokens" className="mt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Token transfers will be displayed here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {summary.hasEncryptedBalance && (
            <Card>
              <CardHeader>
                <CardTitle>Encrypted Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-encrypted/5 dark:bg-encrypted-dark/5 rounded-lg border border-encrypted/20">
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">Encrypted Balance Handle</div>
                      <div className="font-mono text-sm text-encrypted dark:text-encrypted-dark">
                        0x{address.slice(2, 34)}
                      </div>
                    </div>
                    <EncryptedBadge 
                      value={{ 
                        type: "euint64", 
                        handle: "0x" + address.slice(2, 18),
                        authorized: false 
                      }} 
                    />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    This address has encrypted balances. Connect your wallet to decrypt values if you have proper ACL permissions.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
