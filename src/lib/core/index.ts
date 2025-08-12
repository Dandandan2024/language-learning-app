// Export all core functionality
export * from './types';
export * from './fsrs';
export * from './placement';
export * from './schemas';

// Utility functions
export function generateUniqueHash(text: string): string {
  // Simple hash function for sentence deduplication
  // In production, you might want to use a proper hash library
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export function normalizeText(text: string): string {
  // Normalize text for consistent hashing and comparison
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, ''); // Remove punctuation for normalization
}

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}
