import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import * as blockchain from "./blockchain";
import { generateBlock, generateTransaction, getInitialBlocks } from "./mock-blockchain";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time block updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Track connected clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast new blocks to all connected clients
  function broadcastNewBlock(block: any) {
    const message = JSON.stringify({ type: 'new_block', data: block });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Poll for new blocks
  let lastBlockNumber = 0;
  let useMockData = false;
  
  async function pollBlocks() {
    // Skip if using mock data
    if (useMockData) {
      throw new Error("Using mock data - skip RPC polling");
    }

    try {
      const latestBlockNumber = await blockchain.getLatestBlockNumber();
      
      if (latestBlockNumber > lastBlockNumber) {
        // Fetch and store new blocks
        for (let i = lastBlockNumber + 1; i <= latestBlockNumber; i++) {
          const block = await blockchain.getBlock(i);
          if (block) {
            await storage.storeBlock(block);
            
            // Fetch and store transactions for this block
            const transactions = await blockchain.getBlockTransactions(i);
            for (const tx of transactions) {
              await storage.storeTransaction(tx);
            }
            
            broadcastNewBlock(block);
          }
        }
        
        lastBlockNumber = latestBlockNumber;
      }
    } catch (error) {
      console.error('Error polling blocks:', error);
    }
  }

  // Initialize with some blocks
  async function initializeBlocks() {
    try {
      // Try to connect to Zama RPC first
      try {
        const latestBlockNumber = await blockchain.getLatestBlockNumber();
        lastBlockNumber = latestBlockNumber;
        
        // Load last 10 blocks
        const startBlock = Math.max(0, latestBlockNumber - 10);
        for (let i = startBlock; i <= latestBlockNumber; i++) {
          const block = await blockchain.getBlock(i);
          if (block) {
            await storage.storeBlock(block);
            
            const transactions = await blockchain.getBlockTransactions(i);
            for (const tx of transactions) {
              await storage.storeTransaction(tx);
            }
          }
        }
        
        console.log(`Initialized with real blocks ${startBlock} to ${latestBlockNumber}`);
      } catch (rpcError) {
        // Fallback to mock data if RPC is unavailable
        console.log('Zama RPC unavailable, using mock data for demonstration');
        useMockData = true;
        
        const { blocks, transactions } = getInitialBlocks(15);
        
        for (const block of blocks) {
          await storage.storeBlock(block);
        }
        
        for (const tx of transactions) {
          await storage.storeTransaction(tx);
        }
        
        lastBlockNumber = blocks[blocks.length - 1].number;
        console.log(`Initialized with ${blocks.length} mock blocks`);
      }
    } catch (error) {
      console.error('Error initializing blocks:', error);
    }
  }

  // Initialize and start polling
  initializeBlocks().then(() => {
    // Generate new mock blocks periodically when using mock data
    setInterval(async () => {
      try {
        await pollBlocks();
      } catch (error) {
        // If RPC polling fails, generate mock block
        const block = generateBlock();
        await storage.storeBlock(block);
        
        // Generate transactions for this block
        for (let i = 0; i < block.transactionCount; i++) {
          const tx = generateTransaction(block.number, block.timestamp, i);
          await storage.storeTransaction(tx);
        }
        
        lastBlockNumber = block.number;
        broadcastNewBlock(block);
      }
    }, 8000); // Every 8 seconds
  });

  // API Routes

  // Network stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getNetworkStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch network stats" });
    }
  });

  // Latest blocks
  app.get("/api/blocks/latest", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const blocks = await storage.getLatestBlocks(limit);
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest blocks" });
    }
  });

  // Block by number
  app.get("/api/blocks/:number", async (req, res) => {
    try {
      const blockNumber = parseInt(req.params.number);
      let block = await storage.getBlock(blockNumber);
      
      // If not in storage, fetch from blockchain
      if (!block) {
        block = await blockchain.getBlock(blockNumber);
        if (block) {
          await storage.storeBlock(block);
        }
      }
      
      if (!block) {
        return res.status(404).json({ error: "Block not found" });
      }
      
      res.json(block);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch block" });
    }
  });

  // Block transactions
  app.get("/api/blocks/:number/transactions", async (req, res) => {
    try {
      const blockNumber = parseInt(req.params.number);
      let transactions = await storage.getBlockTransactions(blockNumber);
      
      // If not in storage, fetch from blockchain
      if (transactions.length === 0) {
        transactions = await blockchain.getBlockTransactions(blockNumber);
        for (const tx of transactions) {
          await storage.storeTransaction(tx);
        }
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch block transactions" });
    }
  });

  // Latest transactions
  app.get("/api/transactions/latest", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getLatestTransactions(limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest transactions" });
    }
  });

  // Transaction by hash
  app.get("/api/transactions/:hash", async (req, res) => {
    try {
      const hash = req.params.hash;
      let transaction = await storage.getTransaction(hash);
      
      // If not in storage, fetch from blockchain
      if (!transaction) {
        transaction = await blockchain.getTransaction(hash);
        if (transaction) {
          await storage.storeTransaction(transaction);
        }
      }
      
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  // Address summary
  app.get("/api/addresses/:address/summary", async (req, res) => {
    try {
      const address = req.params.address;
      let summary = await storage.getAddressSummary(address);
      
      // If not in storage, try to fetch from blockchain
      if (!summary) {
        const transactions = await blockchain.getAddressTransactions(address, 10);
        for (const tx of transactions) {
          await storage.storeTransaction(tx);
        }
        summary = await storage.getAddressSummary(address);
      }
      
      if (!summary) {
        // Return default summary
        summary = {
          address,
          balance: "0",
          transactionCount: 0,
          hasEncryptedBalance: false,
        };
      }
      
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch address summary" });
    }
  });

  // Address transactions
  app.get("/api/addresses/:address/transactions", async (req, res) => {
    try {
      const address = req.params.address;
      let transactions = await storage.getAddressTransactions(address);
      
      // If not in storage, fetch from blockchain
      if (transactions.length === 0) {
        transactions = await blockchain.getAddressTransactions(address, 10);
        for (const tx of transactions) {
          await storage.storeTransaction(tx);
        }
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch address transactions" });
    }
  });

  return httpServer;
}
