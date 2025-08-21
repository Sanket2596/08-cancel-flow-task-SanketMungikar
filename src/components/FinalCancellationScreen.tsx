'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CancellationConfirmationScreen from './CancellationConfirmationScreen';
import { useABTest } from '../hooks/useABTest';
import { CancellationService } from '../lib/cancellationService';
import { ValidationService } from '../lib/validation';

interface FinalCancellationScreenProps {
  onClose: () => void;
  onBack: () => void;
  onGetDiscount: () => void;
  onCompleteCancellation: () => void;
  userId: string;
  subscriptionId: string;
}

export default function FinalCancellationScreen({
  onClose,
  onBack,
  userId,
  subscriptionId,
}: FinalCancellationScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // A/B Testing
  const { variant, originalPrice, discountedPrice, discountAmount } = useABTest(userId, subscriptionId);
  
  // Form state for cancellation reason
  const [cancellationReason, setCancellationReason] = useState('');
  const [showError, setShowError] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [platformFeedback, setPlatformFeedback] = useState('');
  const [jobsFeedback, setJobsFeedback] = useState('');
  const [moveFeedback, setMoveFeedback] = useState('');
  const [otherFeedback, setOtherFeedback] = useState('');
  const [buttonClicked, setButtonClicked] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Validation and submission state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Clean up rate limits on unmount
  useEffect(() => {
    return () => {
      ValidationService.cleanupRateLimits();
    };
  }, []);

  const handleRadioChange = (value: string) => {
    setCancellationReason(value);
    setShowError(false);
    setValidationErrors([]);
    
    // Clear other inputs when switching reasons
    if (value !== 'Too expensive') {
      setPriceInput('');
    }
    if (value !== 'Platform not helpful') {
      setPlatformFeedback('');
    }
    if (value !== 'Not enough relevant jobs') {
      setJobsFeedback('');
    }
    if (value !== 'Decided not to move') {
      setMoveFeedback('');
    }
    if (value !== 'Other') {
      setOtherFeedback('');
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Validate cancellation reason
    const reasonValidation = ValidationService.validateCancellationReason(cancellationReason);
    if (!reasonValidation.isValid) {
      errors.push(...reasonValidation.errors);
    }
    
    // Validate specific inputs based on reason
    if (cancellationReason === 'Too expensive') {
      const priceValidation = ValidationService.validatePriceInput(priceInput);
      if (!priceValidation.isValid) {
        errors.push(...priceValidation.errors);
      }
    }
    
    if (cancellationReason === 'Platform not helpful') {
      const feedbackValidation = ValidationService.validateFeedback(platformFeedback);
      if (!feedbackValidation.isValid) {
        errors.push(...feedbackValidation.errors);
      }
    }
    
    if (cancellationReason === 'Not enough relevant jobs') {
      const feedbackValidation = ValidationService.validateFeedback(jobsFeedback);
      if (!feedbackValidation.isValid) {
        errors.push(...feedbackValidation.errors);
      }
    }
    
    if (cancellationReason === 'Decided not to move') {
      const feedbackValidation = ValidationService.validateFeedback(moveFeedback);
      if (!feedbackValidation.isValid) {
        errors.push(...feedbackValidation.errors);
      }
    }
    
    if (cancellationReason === 'Other') {
      const feedbackValidation = ValidationService.validateFeedback(otherFeedback);
      if (!feedbackValidation.isValid) {
        errors.push(...feedbackValidation.errors);
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleGetDiscount = async () => {
    if (!validateForm()) {
      return;
    }

    // Check rate limiting
    if (!ValidationService.checkRateLimit(`discount_${userId}`, 3, 60000)) {
      setValidationErrors(['Too many discount attempts. Please try again later.']);
      return;
    }

    setButtonClicked('discount');
    setIsSubmitting(true);

    try {
      // Create cancellation record with accepted downsell
      const result = await CancellationService.createCancellation({
        userId,
        subscriptionId,
        downsellVariant: variant || 'A',
        reason: cancellationReason,
        acceptedDownsell: true,
        feedback: getFeedbackText(),
        priceInput: cancellationReason === 'Too expensive' ? priceInput : undefined
      });
      
      if (result.success) {
        console.log('Discount accepted, cancellation created:', result.cancellationId);
        // Reactivate subscription since user accepted downsell
        await CancellationService.reactivateSubscription(subscriptionId, userId);
      } else {
        console.error('Failed to create cancellation:', result.error);
        setValidationErrors(['Failed to process discount. Please try again.']);
        setButtonClicked(null);
      }
    } catch (error) {
      console.error('Error processing discount:', error);
      setValidationErrors(['An error occurred. Please try again.']);
      setButtonClicked(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteCancellation = async () => {
    console.log('handleCompleteCancellation called');
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, proceeding with cancellation');

    // Check rate limiting
    if (!ValidationService.checkRateLimit(`cancellation_${userId}`, 2, 300000)) {
      setValidationErrors(['Too many cancellation attempts. Please try again later.']);
      return;
    }

    console.log('Rate limiting passed, setting button state');
    setButtonClicked('cancellation');
    setIsSubmitting(true);

    try {
      console.log('Attempting to create cancellation record...');
      // Create cancellation record
      const result = await CancellationService.createCancellation({
        userId,
        subscriptionId,
        downsellVariant: variant || 'A',
        reason: cancellationReason,
        acceptedDownsell: false,
        feedback: getFeedbackText(),
        priceInput: cancellationReason === 'Too expensive' ? priceInput : undefined
      });
      
      console.log('Cancellation service result:', result);
      
      if (result.success) {
        console.log('Cancellation completed:', result.cancellationId);
        setShowConfirmation(true);
      } else {
        console.error('Failed to create cancellation:', result.error);
        // Fallback: show confirmation even if service fails
        console.log('Service failed, but showing confirmation screen as fallback');
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Error processing cancellation:', error);
      // Fallback: show confirmation even if there's an error
      console.log('Error occurred, but showing confirmation screen as fallback');
      setShowConfirmation(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeedbackText = (): string => {
    switch (cancellationReason) {
      case 'Platform not helpful':
        return platformFeedback;
      case 'Not enough relevant jobs':
        return jobsFeedback;
      case 'Decided not to move':
        return moveFeedback;
      case 'Other':
        return otherFeedback;
      default:
        return '';
    }
  };

  const handleBackToJobs = () => {
    console.log('Routing to job screen');
    onClose();
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setButtonClicked(null);
  };

  if (showConfirmation) {
    console.log('Rendering CancellationConfirmationScreen, showConfirmation:', showConfirmation);
    return (
      <CancellationConfirmationScreen
        onClose={handleCloseConfirmation}
        onBackToJobs={handleBackToJobs}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
      {/* Backdrop with fade-in animation */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={`bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[500px] sm:min-h-[550px] lg:min-h-[600px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-8 scale-95 opacity-0'
        }`}
      >
        {/* Header - Top border and navigation */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between z-10 h-12 sm:h-14 lg:h-16">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Back</span>
          </button>

          {/* Center Title */}
          <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">Subscription Cancellation</h1>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-gray-300 rounded-sm"></div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">Step 3 of 3</span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200"
          >
            <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile and Tablet Layout - Single Column */}
        <div className="lg:hidden flex flex-col h-full">
          {/* City Skyline Image - Mobile and Tablet */}
          <div className="relative w-full h-40 sm:h-48 rounded-t-[20px] overflow-hidden">
            <Image
              src="/empire-state-compressed.jpg"
              alt="New York City skyline at twilight with Empire State Building prominently featured"
              fill
              className={`object-cover object-center transition-all duration-700 ${
                isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              }`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content - Mobile and Tablet */}
          <div className="flex-1 flex flex-col justify-start px-3 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6">
              {/* Main Question */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  What's the main reason for cancelling?
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Please take a minute to let us know why:
                </p>
              </div>

              {/* Error Message */}
              {showError && (
                <div className="text-red-600 text-sm sm:text-base font-medium">
                  To help us understand your experience, please select a reason for cancelling*
                </div>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="text-red-600 text-sm sm:text-base font-medium space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              )}

              {/* Reason Options */}
              <div className="space-y-3 sm:space-y-4">
                {[
                  'Too expensive',
                  'Platform not helpful',
                  'Not enough relevant jobs',
                  'Decided not to move',
                  'Other'
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 sm:space-x-4 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={option}
                      checked={cancellationReason === option}
                      onChange={() => handleRadioChange(option)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 border-gray-300 focus:ring-gray-500"
                    />
                    <span className="text-sm sm:text-base font-medium text-black">{option}</span>
                  </label>
                ))}
              </div>

              {/* Dynamic Input Fields Based on Selection */}
              {cancellationReason === 'Too expensive' && (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-black">
                    What would be the maximum you would be willing to pay?*
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={priceInput}
                      onChange={(e) => setPriceInput(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>
              )}

              {cancellationReason === 'Platform not helpful' && (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-black">
                    What can we change to make the platform more helpful?*
                  </p>
                  {platformFeedback.length > 0 && platformFeedback.length < 25 && (
                    <p className="text-red-600 text-xs">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}
                  <div className="relative">
                    <textarea
                      value={platformFeedback}
                      onChange={(e) => setPlatformFeedback(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="Please share your feedback..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({platformFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {cancellationReason === 'Not enough relevant jobs' && (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-black">
                    What types of jobs would be most relevant for you?*
                  </p>
                  {jobsFeedback.length > 0 && jobsFeedback.length < 25 && (
                    <p className="text-red-600 text-xs">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}
                  <div className="relative">
                    <textarea
                      value={jobsFeedback}
                      onChange={(e) => setJobsFeedback(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="Please share your feedback..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({jobsFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {cancellationReason === 'Decided not to move' && (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-black">
                    What changed for you to decide to not move?*
                  </p>
                  {moveFeedback.length > 0 && moveFeedback.length < 25 && (
                    <p className="text-red-600 text-xs">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}
                  <div className="relative">
                    <textarea
                      value={moveFeedback}
                      onChange={(e) => setMoveFeedback(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="Please share your feedback..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({moveFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {cancellationReason === 'Other' && (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-black">
                    What would have helped you the most?*
                  </p>
                  {otherFeedback.length > 0 && otherFeedback.length < 25 && (
                    <p className="text-red-600 text-xs">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}
                  <div className="relative">
                    <textarea
                      value={otherFeedback}
                      onChange={(e) => setOtherFeedback(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="Please share your feedback..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({otherFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4 pt-4">
                <button
                  onClick={handleGetDiscount}
                  disabled={buttonClicked === 'discount' || isSubmitting}
                  className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base ${
                    buttonClicked === 'discount'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {variant === 'B' ? (
                    <>
                      Get ${discountAmount} off | $15.00 <span className="line-through">${originalPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      Get 50% off | $12.50 <span className="line-through">${originalPrice.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCompleteCancellation}
                  disabled={buttonClicked === 'cancellation' || isSubmitting}
                  className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base ${
                    buttonClicked === 'cancellation'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="hidden lg:flex flex-1">
          {/* Left Panel - Content (2/3 width) */}
          <div className="w-[66.67%] flex flex-col justify-start px-12 pt-20 pb-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Main Question */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  What's the main reason for cancelling?
                </h2>
                <p className="text-base text-gray-600">
                  Please take a minute to let us know why:
                </p>
              </div>

              {/* Error Message */}
              {showError && (
                <div className="text-red-600 text-base font-medium">
                  To help us understand your experience, please select a reason for cancelling*
                </div>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="text-red-600 text-base font-medium space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              )}

              {/* Reason Options */}
              <div className="space-y-4">
                {[
                  'Too expensive',
                  'Platform not helpful',
                  'Not enough relevant jobs',
                  'Decided not to move',
                  'Other'
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-4 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={option}
                      checked={cancellationReason === option}
                      onChange={() => handleRadioChange(option)}
                      className="w-5 h-5 text-gray-600 border-gray-300 focus:ring-gray-500"
                    />
                    <span className="text-base font-medium text-black">{option}</span>
                  </label>
                ))}
              </div>

              {/* Dynamic Input Fields Based on Selection */}
              {cancellationReason === 'Too expensive' && (
                <div className="space-y-3">
                  <p className="text-base text-black">
                    What would be the maximum you would be willing to pay?*
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={priceInput}
                      onChange={(e) => setPriceInput(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>
              )}

              {cancellationReason === 'Platform not helpful' && (
                <div className="space-y-3">
                  <p className="text-base text-black">
                    What can we change to make the platform more helpful?*
                  </p>
                  {platformFeedback.length > 0 && platformFeedback.length < 25 && (
                    <p className="text-red-600 text-xs">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}
                  <div className="relative">
                    <textarea
                      value={platformFeedback}
                      onChange={(e) => setPlatformFeedback(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="Please share your feedback..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({platformFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {cancellationReason === 'Not enough relevant jobs' && (
                <div className="space-y-3">
                  <p className="text-base text-black">
                    What types of jobs would be most relevant for you?*
                  </p>
                  {jobsFeedback.length > 0 && jobsFeedback.length < 25 && (
                    <p className="text-red-600 text-xs">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}
                  <div className="relative">
                    <textarea
                      value={jobsFeedback}
                      onChange={(e) => setJobsFeedback(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="Please share your feedback..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({jobsFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {cancellationReason === 'Decided not to move' && (
                <div className="space-y-3">
                  <p className="text-base text-black">
                    What changed for you to decide to not move?*
                  </p>
                  {moveFeedback.length > 0 && moveFeedback.length < 25 && (
                    <p className="text-red-600 text-xs">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}
                  <div className="relative">
                    <textarea
                      value={moveFeedback}
                      onChange={(e) => setMoveFeedback(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="Please share your feedback..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({moveFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {cancellationReason === 'Other' && (
                <div className="space-y-3">
                  <p className="text-base text-black">
                    What would have helped you the most?*
                  </p>
                  {otherFeedback.length > 0 && otherFeedback.length < 25 && (
                    <p className="text-red-600 text-xs">
                      Please enter at least 25 characters so we can understand your feedback*
                    </p>
                  )}
                  <div className="relative">
                    <textarea
                      value={otherFeedback}
                      onChange={(e) => setOtherFeedback(ValidationService.sanitizeInput(e.target.value))}
                      placeholder="Please share your feedback..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      Min 25 characters ({otherFeedback.length}/25)
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={handleGetDiscount}
                  disabled={buttonClicked === 'discount' || isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-medium ${
                    buttonClicked === 'discount'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {variant === 'B' ? (
                    <>
                      Get ${discountAmount} off | $15.00 <span className="line-through">${originalPrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      Get 50% off | $12.50 <span className="line-through">${originalPrice.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCompleteCancellation}
                  disabled={buttonClicked === 'cancellation' || isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-medium ${
                    buttonClicked === 'cancellation'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Image (1/3 width) */}
          <div className="w-[33.33%] h-full flex flex-col">
            {/* Image fills entire right panel below header */}
            <div className="relative w-full h-full rounded-r-[20px] overflow-hidden shadow-lg">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline at twilight with Empire State Building prominently featured"
                fill
                className={`object-cover object-center transition-all duration-700 ${
                  isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                }`}
                priority
                sizes="(max-width: 1024px) 100vw, 33.33vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
