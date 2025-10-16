import { JsonRpcProvider } from "ethers";
import type { Block, Transaction } from "@shared/schema";

const ZAMA_RPC_URL = "https://devnet.zama.ai";

let provider: JsonRpcProvider | null = null;
let providerInitialized = false;

function getProvider(): JsonRpcProvider {
  if (!provider && !providerInitialized) {
    // Only create provider once to avoid multiple connection attempts
    providerInitialized = true;
    provider = new JsonRpcProvider(ZAMA_RPC_URL);
  }
  
  if (!provider) {
    throw new Error("Provider not available");
  }
  
  return provider;
}

export async function getLatestBlockNumber(): Promise<number> {
  return await getProvider().getBlockNumber();
}

export async function getBlock(blockNumber: number): Promise<Block | undefined> {
  try {
    const block = await getProvider().getBlock(blockNumber, true);
    if (!block) return undefined;

    return {
      number: block.number,
      hash: block.hash || "",
      timestamp: block.timestamp,
      parentHash: block.parentHash,
      gasUsed: Number(block.gasUsed),
      gasLimit: Number(block.gasLimit),
      transactionCount: block.transactions.length,
      miner: block.miner || "0x0000000000000000000000000000000000000000",
    };
  } catch (error) {
    console.error(`Error fetching block ${blockNumber}:`, error);
    return undefined;
  }
}

export async function getTransaction(hash: string): Promise<Transaction | undefined> {
  try {
    const tx = await getProvider().getTransaction(hash);
    if (!tx) return undefined;

    const receipt = await getProvider().getTransactionReceipt(hash);
    const block = await getProvider().getBlock(tx.blockNumber || 0);

    // Detect encrypted data in input
    const hasEncryptedData = tx.data.length > 2 && tx.data.includes("fhe");

    return {
      hash: tx.hash,
      blockNumber: tx.blockNumber || 0,
      from: tx.from,
      to: tx.to || null,
      value: tx.value.toString(),
      gasPrice: tx.gasPrice?.toString() || "0",
      gas: Number(tx.gasLimit),
      gasUsed: receipt ? Number(receipt.gasUsed) : null,
      input: tx.data,
      nonce: Number(tx.nonce),
      transactionIndex: tx.index || 0,
      status: receipt ? receipt.status === 1 : null,
      timestamp: block?.timestamp || 0,
      hasEncryptedData,
    };
  } catch (error) {
    console.error(`Error fetching transaction ${hash}:`, error);
    return undefined;
  }
}

export async function getBlockTransactions(blockNumber: number): Promise<Transaction[]> {
  try {
    const block = await getProvider().getBlock(blockNumber, true);
    if (!block || !block.transactions) return [];

    const txPromises = block.transactions.map(async (txHash) => {
      if (typeof txHash === "string") {
        return getTransaction(txHash);
      }
      return null;
    });

    const transactions = await Promise.all(txPromises);
    return transactions.filter((tx): tx is Transaction => tx !== null);
  } catch (error) {
    console.error(`Error fetching block transactions:`, error);
    return [];
  }
}

export async function getAddressTransactions(
  address: string,
  limit: number = 10
): Promise<Transaction[]> {
  try {
    const latestBlock = await getLatestBlockNumber();
    const transactions: Transaction[] = [];
    
    // Search last 100 blocks for transactions involving this address
    const searchBlocks = Math.min(100, latestBlock);
    
    for (let i = latestBlock; i > latestBlock - searchBlocks && transactions.length < limit; i--) {
      const blockTxs = await getBlockTransactions(i);
      const relevantTxs = blockTxs.filter(
        (tx) => tx.from.toLowerCase() === address.toLowerCase() || 
                tx.to?.toLowerCase() === address.toLowerCase()
      );
      transactions.push(...relevantTxs);
      
      if (transactions.length >= limit) break;
    }

    return transactions.slice(0, limit);
  } catch (error) {
    console.error(`Error fetching address transactions:`, error);
    return [];
  }
}
