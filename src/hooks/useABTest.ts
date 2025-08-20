import { useState, useEffect } from 'react';

interface UseABTestOptions {
  userId?: string;
  testName: string;
  variantA: string;
  variantB: string;
}

export function useABTest({ userId, testName, variantA, variantB }: UseABTestOptions) {
  const [variant, setVariant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple deterministic A/B testing based on user ID
    // If no userId provided, use a random number for demo purposes
    const seed = userId || Math.random().toString();
    
    // Create a simple hash from the seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use the hash to determine variant (50/50 split)
    const isVariantA = Math.abs(hash) % 2 === 0;
    const selectedVariant = isVariantA ? variantA : variantB;
    
    setVariant(selectedVariant);
    setIsLoading(false);
    
    // Log for debugging (remove in production)
    console.log(`A/B Test "${testName}": User ${userId || 'anonymous'} assigned to variant: ${selectedVariant}`);
  }, [userId, testName, variantA, variantB]);

  return {
    variant,
    isLoading,
    isVariantA: variant === variantA,
    isVariantB: variant === variantB,
  };
}
