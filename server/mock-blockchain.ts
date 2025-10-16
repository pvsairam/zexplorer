import type { Block, Transaction } from "@shared/schema";

// Mock blockchain data generator for demo purposes
// This simulates Zama fhEVM blockchain when RPC is unavailable

let blockCounter = 1000;
let timestampCounter = Date.now() / 1000;

function generateRandomHash(): string {
  return "0x" + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

function generateRandomAddress(): string {
  return "0x" + Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

export function generateBlock(): Block {
  const block: Block = {
    number: blockCounter++,
    hash: generateRandomHash(),
    timestamp: Math.floor(timestampCounter),
    parentHash: generateRandomHash(),
    gasUsed: Math.floor(Math.random() * 5000000) + 1000000,
    gasLimit: 8000000,
    transactionCount: Math.floor(Math.random() * 10) + 1,
    miner: generateRandomAddress(),
  };
  
  timestampCounter += 12; // 12 second block time
  return block;
}

export function generateTransaction(blockNumber: number, blockTimestamp: number, index: number): Transaction {
  const hasEncryptedData = Math.random() > 0.6; // 40% chance of encrypted data
  
  return {
    hash: generateRandomHash(),
    blockNumber,
    from: generateRandomAddress(),
    to: Math.random() > 0.1 ? generateRandomAddress() : null, // 10% contract creation
    value: (BigInt(Math.floor(Math.random() * 1000000000000000000))).toString(),
    gasPrice: "2000000000", // 2 gwei
    gas: 21000 + Math.floor(Math.random() * 200000),
    gasUsed: 21000 + Math.floor(Math.random() * 100000),
    input: hasEncryptedData ? 
      "0xfhe" + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join("") :
      "0x",
    nonce: Math.floor(Math.random() * 100),
    transactionIndex: index,
    status: Math.random() > 0.05, // 95% success rate
    timestamp: blockTimestamp,
    hasEncryptedData,
  };
}

export function getInitialBlocks(count: number): { blocks: Block[], transactions: Transaction[] } {
  const blocks: Block[] = [];
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const block = generateBlock();
    blocks.push(block);
    
    // Generate transactions for this block
    for (let j = 0; j < block.transactionCount; j++) {
      transactions.push(generateTransaction(block.number, block.timestamp, j));
    }
  }
  
  return { blocks, transactions };
}
