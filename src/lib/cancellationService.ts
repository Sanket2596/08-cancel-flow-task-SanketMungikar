import { supabase, supabaseAdmin } from './supabase';
import { DownsellVariant } from '../hooks/useABTest';

export interface CancellationData {
  userId: string;
  subscriptionId: string;
  downsellVariant: DownsellVariant;
  reason: string;
  acceptedDownsell: boolean;
  feedback?: string;
  priceInput?: string;
}

export interface CancellationResult {
  success: boolean;
  error?: string;
  cancellationId?: string;
}

export class CancellationService {
  /**
   * Mark subscription as pending cancellation and create cancellation record
   */
  static async createCancellation(data: CancellationData): Promise<CancellationResult> {
    try {
      // Check if Supabase is properly initialized
      if (!supabaseAdmin || !supabaseAdmin.from) {
        console.warn('Supabase admin not initialized');
        return {
          success: false,
          error: 'Database service not available'
        };
      }

      // Start a transaction-like operation
      // First, mark subscription as pending cancellation
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({ 
          status: 'pending_cancellation',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.subscriptionId)
        .eq('user_id', data.userId);

      if (updateError) {
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }

      // Create cancellation record
      const { data: cancellation, error: insertError } = await supabaseAdmin
        .from('cancellations')
        .insert({
          user_id: data.userId,
          subscription_id: data.subscriptionId,
          downsell_variant: data.downsellVariant,
          reason: data.reason,
          accepted_downsell: data.acceptedDownsell,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (insertError) {
        throw new Error(`Failed to create cancellation record: ${insertError.message}`);
      }

      return {
        success: true,
        cancellationId: cancellation.id
      };

    } catch (error) {
      console.error('Error creating cancellation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get user's cancellation history
   */
  static async getCancellationHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cancellations')
        .select(`
          id,
          reason,
          downsell_variant,
          accepted_downsell,
          created_at,
          subscriptions(monthly_price, status)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch cancellation history: ${error.message}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching cancellation history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Update cancellation record (e.g., when user accepts downsell)
   */
  static async updateCancellation(
    cancellationId: string, 
    updates: Partial<Pick<CancellationData, 'acceptedDownsell' | 'feedback'>>
  ): Promise<CancellationResult> {
    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.acceptedDownsell !== undefined) {
        updateData.accepted_downsell = updates.acceptedDownsell;
      }

      if (updates.feedback) {
        updateData.feedback = updates.feedback;
      }

      const { error } = await supabaseAdmin
        .from('cancellations')
        .update(updateData)
        .eq('id', cancellationId);

      if (error) {
        throw new Error(`Failed to update cancellation: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating cancellation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Reactivate subscription (when user accepts downsell)
   */
  static async reactivateSubscription(subscriptionId: string, userId: string): Promise<CancellationResult> {
    try {
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to reactivate subscription: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
