import { type Block, type Transaction, type AddressSummary, type NetworkStats } from "@shared/schema";

export interface IStorage {
  // Blocks
  getBlock(number: number): Promise<Block | undefined>;
  getLatestBlocks(limit: number): Promise<Block[]>;
  storeBlock(block: Block): Promise<void>;
  
  // Transactions
  getTransaction(hash: string): Promise<Transaction | undefined>;
  getLatestTransactions(limit: number): Promise<Transaction[]>;
  getBlockTransactions(blockNumber: number): Promise<Transaction[]>;
  getAddressTransactions(address: string): Promise<Transaction[]>;
  storeTransaction(transaction: Transaction): Promise<void>;
  
  // Address
  getAddressSummary(address: string): Promise<AddressSummary | undefined>;
  
  // Stats
  getNetworkStats(): Promise<NetworkStats>;
}

export class MemStorage implements IStorage {
  private blocks: Map<number, Block>;
  private transactions: Map<string, Transaction>;
  private addressTxMap: Map<string, string[]>; // address -> tx hashes

  constructor() {
    this.blocks = new Map();
    this.transactions = new Map();
    this.addressTxMap = new Map();
  }

  async getBlock(number: number): Promise<Block | undefined> {
    return this.blocks.get(number);
  }

  async getLatestBlocks(limit: number): Promise<Block[]> {
    const blocks = Array.from(this.blocks.values())
      .sort((a, b) => b.number - a.number)
      .slice(0, limit);
    return blocks;
  }

  async storeBlock(block: Block): Promise<void> {
    this.blocks.set(block.number, block);
  }

  async getTransaction(hash: string): Promise<Transaction | undefined> {
    return this.transactions.get(hash.toLowerCase());
  }

  async getLatestTransactions(limit: number): Promise<Transaction[]> {
    const txs = Array.from(this.transactions.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
    return txs;
  }

  async getBlockTransactions(blockNumber: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.blockNumber === blockNumber)
      .sort((a, b) => a.transactionIndex - b.transactionIndex);
  }

  async getAddressTransactions(address: string): Promise<Transaction[]> {
    const txHashes = this.addressTxMap.get(address.toLowerCase()) || [];
    const txs = txHashes
      .map((hash) => this.transactions.get(hash))
      .filter((tx): tx is Transaction => tx !== undefined)
      .sort((a, b) => b.timestamp - a.timestamp);
    return txs;
  }

  async storeTransaction(transaction: Transaction): Promise<void> {
    const txHash = transaction.hash.toLowerCase();
    this.transactions.set(txHash, transaction);

    // Update address transaction map
    const fromAddr = transaction.from.toLowerCase();
    if (!this.addressTxMap.has(fromAddr)) {
      this.addressTxMap.set(fromAddr, []);
    }
    this.addressTxMap.get(fromAddr)!.push(txHash);

    if (transaction.to) {
      const toAddr = transaction.to.toLowerCase();
      if (!this.addressTxMap.has(toAddr)) {
        this.addressTxMap.set(toAddr, []);
      }
      this.addressTxMap.get(toAddr)!.push(txHash);
    }
  }

  async getAddressSummary(address: string): Promise<AddressSummary | undefined> {
    const txs = await this.getAddressTransactions(address);
    if (txs.length === 0) return undefined;

    // Calculate balance from transactions
    let balance = BigInt(0);
    let hasEncryptedBalance = false;

    for (const tx of txs) {
      if (tx.to?.toLowerCase() === address.toLowerCase()) {
        balance += BigInt(tx.value);
        if (tx.hasEncryptedData) hasEncryptedBalance = true;
      }
      if (tx.from.toLowerCase() === address.toLowerCase()) {
        balance -= BigInt(tx.value);
      }
    }

    return {
      address,
      balance: balance.toString(),
      transactionCount: txs.length,
      hasEncryptedBalance,
    };
  }

  async getNetworkStats(): Promise<NetworkStats> {
    const totalBlocks = this.blocks.size;
    const totalTransactions = this.transactions.size;
    const activeAddresses = this.addressTxMap.size;
    
    // Count encrypted transactions as coprocessor jobs
    const coprocessorJobs = Array.from(this.transactions.values())
      .filter((tx) => tx.hasEncryptedData)
      .length;

    return {
      totalBlocks,
      totalTransactions,
      activeAddresses,
      coprocessorJobs,
    };
  }
}

export const storage = new MemStorage();
