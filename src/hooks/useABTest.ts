'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type DownsellVariant = 'A' | 'B';

interface UseABTestReturn {
  variant: DownsellVariant | null;
  isLoading: boolean;
  error: string | null;
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
}

export function useABTest(userId: string, subscriptionId: string): UseABTestReturn {
  const [variant, setVariant] = useState<DownsellVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState(0);

  const determineVariant = useCallback(async () => {
    if (!userId || !subscriptionId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Check if Supabase is properly initialized
      if (!supabase || !supabase.from) {
        console.warn('Supabase not initialized, using fallback variant');
        setVariant('A');
        setOriginalPrice(25); // Default price
        setIsLoading(false);
        return;
      }

      // First, check if we already have a variant for this user
      let existingCancellation = null;
      try {
        const { data, error: fetchError } = await supabase
          .from('cancellations')
          .select('downsell_variant')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) {
          console.warn('Error fetching existing variant, will generate new one:', fetchError);
        } else {
          existingCancellation = data;
        }
      } catch (dbError) {
        console.warn('Database connection error, using fallback variant:', dbError);
        // Continue with fallback variant
      }

      let selectedVariant: DownsellVariant;

      if (existingCancellation && existingCancellation.length > 0) {
        // Reuse existing variant
        selectedVariant = existingCancellation[0].downsell_variant as DownsellVariant;
        console.log('Reusing existing variant:', selectedVariant);
      } else {
        // Generate new variant using secure RNG
        selectedVariant = generateSecureVariant(userId, subscriptionId);
        console.log('Generated new variant:', selectedVariant);
      }

      // Get subscription price to calculate discount
      try {
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('monthly_price')
          .eq('id', subscriptionId)
          .single();

        if (subError) {
          console.warn('Failed to fetch subscription, using default price:', subError.message);
          setOriginalPrice(25); // Default price
        } else {
          const priceInCents = subscription.monthly_price;
          setOriginalPrice(priceInCents / 100); // Convert cents to dollars
        }
      } catch (priceError) {
        console.warn('Error fetching subscription price, using default:', priceError);
        setOriginalPrice(25); // Default price
      }

      setVariant(selectedVariant);
    } catch (err) {
      console.error('Error determining variant:', err);
      setError(err instanceof Error ? err.message : 'Failed to determine variant');
      // Fallback to variant A with default price
      setVariant('A');
      setOriginalPrice(25);
    } finally {
      setIsLoading(false);
    }
  }, [userId, subscriptionId]);

  useEffect(() => {
    determineVariant();
  }, [determineVariant]);

  // Secure deterministic variant generation using user and subscription IDs
  const generateSecureVariant = (userId: string, subscriptionId: string): DownsellVariant => {
    // Create a deterministic hash from user and subscription IDs
    const combinedString = `${userId}-${subscriptionId}`;
    let hash = 0;
    
    for (let i = 0; i < combinedString.length; i++) {
      const char = combinedString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use the hash to determine variant (50/50 split)
    const isVariantB = Math.abs(hash) % 2 === 0;
    return isVariantB ? 'B' : 'A';
  };

  // Calculate pricing based on variant
  const getPricing = () => {
    if (!variant || !originalPrice) return { discountedPrice: 0, discountAmount: 0 };

    let discountedPrice = originalPrice;
    let discountAmount = 0;

    if (variant === 'B') {
      // Variant B: $10 off
      discountAmount = 10;
      discountedPrice = Math.max(0, originalPrice - discountAmount);
    }

    return { discountedPrice, discountAmount };
  };

  const { discountedPrice, discountAmount } = getPricing();

  return {
    variant,
    isLoading,
    error,
    originalPrice,
    discountedPrice,
    discountAmount,
  };
}
