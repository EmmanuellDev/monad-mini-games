/**
 * Local storage for purchase history
 * Stores purchases client-side to persist beyond blockchain query limits
 */

export interface StoredPurchase {
  datasetId: number;
  price: string;
  timestamp: number;
  txHash: string;
  buyerAddress: string;
}

const STORAGE_KEY = 'montify_purchases';

/**
 * Get all stored purchases for a specific address
 */
export function getStoredPurchases(address: string): StoredPurchase[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const allPurchases: StoredPurchase[] = JSON.parse(stored);
    return allPurchases.filter(p => p.buyerAddress.toLowerCase() === address.toLowerCase());
  } catch (error) {
    console.error('Error reading purchases from storage:', error);
    return [];
  }
}

/**
 * Add a new purchase to storage
 */
export function addPurchaseToStorage(purchase: StoredPurchase): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allPurchases: StoredPurchase[] = stored ? JSON.parse(stored) : [];
    
    // Check if this purchase already exists (by txHash)
    const exists = allPurchases.some(p => p.txHash === purchase.txHash);
    if (exists) return;
    
    allPurchases.push(purchase);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPurchases));
  } catch (error) {
    console.error('Error saving purchase to storage:', error);
  }
}

/**
 * Clear all purchases for a specific address
 */
export function clearStoredPurchases(address: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    const allPurchases: StoredPurchase[] = JSON.parse(stored);
    const remaining = allPurchases.filter(p => p.buyerAddress.toLowerCase() !== address.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  } catch (error) {
    console.error('Error clearing purchases from storage:', error);
  }
}

/**
 * Get count of purchases for an address
 */
export function getStoredPurchaseCount(address: string): number {
  return getStoredPurchases(address).length;
}
