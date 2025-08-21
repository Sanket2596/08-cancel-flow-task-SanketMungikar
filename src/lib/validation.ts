/**
 * Validation utilities for the cancellation flow
 * Includes input validation, CSRF protection, and XSS prevention
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  /**
   * Validate cancellation reason
   */
  static validateCancellationReason(reason: string): ValidationResult {
    const errors: string[] = [];
    
    if (!reason || reason.trim().length === 0) {
      errors.push('Cancellation reason is required');
    }
    
    const validReasons = [
      'Too expensive',
      'Platform not helpful', 
      'Not enough relevant jobs',
      'Decided not to move',
      'Other'
    ];
    
    if (!validReasons.includes(reason)) {
      errors.push('Invalid cancellation reason');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate price input for "Too expensive" reason
   */
  static validatePriceInput(price: string): ValidationResult {
    const errors: string[] = [];
    
    if (!price || price.trim().length === 0) {
      errors.push('Price input is required');
      return { isValid: false, errors };
    }
    
    // Remove currency symbols and whitespace
    const cleanPrice = price.replace(/[$,\s]/g, '');
    
    // Check if it's a valid number
    if (isNaN(Number(cleanPrice))) {
      errors.push('Please enter a valid price');
    }
    
    // Check if price is reasonable (between $0.01 and $1000)
    const priceValue = parseFloat(cleanPrice);
    if (priceValue < 0.01 || priceValue > 1000) {
      errors.push('Price must be between $0.01 and $1000');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate feedback text for various reasons
   */
  static validateFeedback(feedback: string, minLength: number = 25): ValidationResult {
    const errors: string[] = [];
    
    if (!feedback || feedback.trim().length === 0) {
      errors.push('Feedback is required');
      return { isValid: false, errors };
    }
    
    if (feedback.trim().length < minLength) {
      errors.push(`Feedback must be at least ${minLength} characters long`);
    }
    
    // Check for potentially malicious content
    if (this.containsXSS(feedback)) {
      errors.push('Feedback contains invalid content');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user ID format
   */
  static validateUserId(userId: string): ValidationResult {
    const errors: string[] = [];
    
    if (!userId || userId.trim().length === 0) {
      errors.push('User ID is required');
      return { isValid: false, errors };
    }
    
    // UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      errors.push('Invalid user ID format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate subscription ID format
   */
  static validateSubscriptionId(subscriptionId: string): ValidationResult {
    const errors: string[] = [];
    
    if (!subscriptionId || subscriptionId.trim().length === 0) {
      errors.push('Subscription ID is required');
      return { isValid: false, errors };
    }
    
    // UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(subscriptionId)) {
      errors.push('Invalid subscription ID format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize input to prevent XSS attacks
   */
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remove potentially dangerous HTML tags and attributes
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  /**
   * Check if input contains potential XSS content
   */
  private static containsXSS(input: string): boolean {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /vbscript:/i,
      /data:/i
    ];
    
    return dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Generate CSRF token (for additional security)
   */
  static generateCSRFToken(): string {
    // In a real application, this would be generated server-side
    // For now, we'll use a simple hash of the current timestamp
    const timestamp = Date.now().toString();
    let hash = 0;
    
    for (let i = 0; i < timestamp.length; i++) {
      const char = timestamp.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken;
  }

  /**
   * Rate limiting check (basic implementation)
   */
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  
  static checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(identifier);
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }
    
    if (record.count >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Increment count
    record.count++;
    return true;
  }

  /**
   * Clean up old rate limit records
   */
  static cleanupRateLimits(): void {
    const now = Date.now();
    for (const [key, record] of this.rateLimitMap.entries()) {
      if (now > record.resetTime) {
        this.rateLimitMap.delete(key);
      }
    }
  }
}
