import { sql } from "drizzle-orm";
import { pgTable, text, varchar, bigint, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Block schema
export const blocks = pgTable("blocks", {
  number: bigint("number", { mode: "number" }).primaryKey(),
  hash: text("hash").notNull().unique(),
  timestamp: bigint("timestamp", { mode: "number" }).notNull(),
  parentHash: text("parent_hash").notNull(),
  gasUsed: bigint("gas_used", { mode: "number" }).notNull(),
  gasLimit: bigint("gas_limit", { mode: "number" }).notNull(),
  transactionCount: bigint("transaction_count", { mode: "number" }).notNull(),
  miner: text("miner").notNull(),
});

// Transaction schema
export const transactions = pgTable("transactions", {
  hash: text("hash").primaryKey(),
  blockNumber: bigint("block_number", { mode: "number" }).notNull(),
  from: text("from").notNull(),
  to: text("to"),
  value: text("value").notNull(),
  gasPrice: text("gas_price").notNull(),
  gas: bigint("gas", { mode: "number" }).notNull(),
  gasUsed: bigint("gas_used", { mode: "number" }),
  input: text("input").notNull(),
  nonce: bigint("nonce", { mode: "number" }).notNull(),
  transactionIndex: bigint("transaction_index", { mode: "number" }).notNull(),
  status: boolean("status"),
  timestamp: bigint("timestamp", { mode: "number" }).notNull(),
  hasEncryptedData: boolean("has_encrypted_data").notNull().default(false),
});

// TypeScript types
export type Block = typeof blocks.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

// Insert schemas
export const insertBlockSchema = createInsertSchema(blocks);
export const insertTransactionSchema = createInsertSchema(transactions);

export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// Additional types for the explorer
export interface EncryptedValue {
  type: "euint8" | "euint16" | "euint32" | "euint64" | "euint128" | "euint256" | "ebool" | "eaddress";
  handle: string;
  authorized: boolean; // Whether current user has ACL permission
}

export interface AddressSummary {
  address: string;
  balance: string;
  transactionCount: number;
  hasEncryptedBalance: boolean;
}

export interface CoprocessorStatus {
  state: "pending" | "computing" | "completed" | "failed";
  estimatedTime?: number;
}

export interface SearchResult {
  type: "block" | "transaction" | "address";
  value: string;
  display: string;
}

// Network stats
export interface NetworkStats {
  totalBlocks: number;
  totalTransactions: number;
  activeAddresses: number;
  coprocessorJobs: number;
}
