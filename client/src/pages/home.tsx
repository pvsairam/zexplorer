import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { NetworkStats } from "@/components/network-stats";
import { BlocksTable } from "@/components/blocks-table";
import { TransactionsTable } from "@/components/transactions-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/use-websocket";
import type { Block, Transaction, NetworkStats as NetworkStatsType } from "@shared/schema";

export default function Home() {
  // Connect to WebSocket for real-time updates
  useWebSocket();

  const { data: stats, isLoading: statsLoading } = useQuery<NetworkStatsType>({
    queryKey: ["/api/stats"],
  });

  const { data: blocks, isLoading: blocksLoading } = useQuery<Block[]>({
    queryKey: ["/api/blocks/latest"],
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/latest"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Zama fhEVM Block Explorer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore encrypted transactions and confidential smart contracts on Zama's Fully Homomorphic Encryption network
            </p>
          </div>
          
          <div className="pt-4">
            <SearchBar variant="hero" />
          </div>
        </div>

        <div className="space-y-8">
          <NetworkStats stats={stats || null} loading={statsLoading} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Latest Blocks</CardTitle>
              </CardHeader>
              <CardContent>
                <BlocksTable 
                  blocks={blocks || []} 
                  loading={blocksLoading} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsTable 
                  transactions={transactions || []} 
                  loading={transactionsLoading} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
