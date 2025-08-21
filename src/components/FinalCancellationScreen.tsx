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
    
    // Rate limiting check
    if (!ValidationService.checkRateLimit(`discount_${userId}`, 3, 60000)) {
      setValidationErrors(['Too many discount attempts. Please try again later.']);
      return;
    }
    
    setIsSubmitting(true);
    setButtonClicked('discount');
    
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
    if (!validateForm()) {
      return;
    }
    
    // Rate limiting check
    if (!ValidationService.checkRateLimit(`cancellation_${userId}`, 2, 300000)) {
      setValidationErrors(['Too many cancellation attempts. Please try again later.']);
      return;
    }
    
    setIsSubmitting(true);
    setButtonClicked('cancellation');
    
    try {
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
      
      if (result.success) {
        console.log('Cancellation completed:', result.cancellationId);
        setShowConfirmation(true);
      } else {
        console.error('Failed to create cancellation:', result.error);
        setValidationErrors(['Failed to process cancellation. Please try again.']);
        setButtonClicked(null);
      }
    } catch (error) {
      console.error('Error processing cancellation:', error);
      setValidationErrors(['An error occurred. Please try again.']);
      setButtonClicked(null);
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
    return (
      <CancellationConfirmationScreen
        onClose={handleCloseConfirmation}
        onBackToJobs={handleBackToJobs}
      />
    );
  }



  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[500px] sm:min-h-[550px] lg:min-h-[500px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-8 scale-95 opacity-0'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Back</span>
          </button>

          <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">Subscription Cancellation</h1>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-gray-300 rounded-sm"></div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 ml-1.5 sm:ml-2">Step 3 of 3</span>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 bg-white rounded-full shadow-sm hover:scale-110 hover:bg-gray-50"
          >
            <svg width="14" height="14" className="sm:w-4 sm:h-4 lg:w-4 lg:h-4" viewBox="0 0 16 16" fill="none">
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

        <div className="lg:hidden flex flex-col h-full">
          <div className="relative w-full h-40 sm:h-48 rounded-t-[20px] overflow-hidden">
            <Image
              src="/timo-wagner-fT6-YkB0nfg-unsplash.jpg"
              alt="New York City skyline at twilight with Empire State Building"
              fill
              className={`object-cover object-center transition-all duration-700 ${
                isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              }`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-y-auto">
            <div className="flex-1 flex flex-col justify-center">
              {!buttonClicked ? (
                <>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    What's the main reason for cancelling?
                  </h2>

                  {/* Validation Errors */}
                  {validationErrors.length > 0 && (
                    <div className="text-red-600 text-sm sm:text-base font-medium space-y-1">
                      {validationErrors.map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  )}

                  {showError && (
                    <div className="text-red-600 text-sm sm:text-base font-medium">
                      To help us understand your experience, please select a reason for cancelling*
                    </div>
                  )}

                  <div className="space-y-3">
                    {[
                      'Too expensive',
                      'Platform not helpful',
                      'Not enough relevant jobs',
                      'Decided not to move',
                      'Other'
                    ].map((option) => (
                      <label
                        key={option}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="cancellationReason"
                          value={option}
                          checked={cancellationReason === option}
                          onChange={() => handleRadioChange(option)}
                          className="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500"
                        />
                        <span className="text-sm sm:text-base text-black">{option}</span>
                      </label>
                    ))}
                  </div>

                  {cancellationReason === 'Too expensive' && (
                    <div className="space-y-2">
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
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black"
                        />
                      </div>
                    </div>
                  )}

                  {cancellationReason === 'Platform not helpful' && (
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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
                    <div className="space-y-2">
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

                  <div className="space-y-3 pt-3">
                    <button
                      onClick={handleGetDiscount}
                      disabled={buttonClicked === 'discount' || isSubmitting}
                      className={`w-full py-3 px-4 rounded-lg font-medium ${
                        buttonClicked === 'discount'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {variant === 'B' ? (
                        `Get $${discountAmount} off | $${discountedPrice.toFixed(2)} <span className="line-through">$${originalPrice.toFixed(2)}</span>`
                      ) : (
                        `Get 50% off | $${discountedPrice.toFixed(2)} <span className="line-through">$${originalPrice.toFixed(2)}</span>`
                      )}
                    </button>

                    <button
                      onClick={handleCompleteCancellation}
                      disabled={buttonClicked === 'cancellation' || isSubmitting}
                      className={`w-full py-3 px-4 rounded-lg font-medium ${
                        buttonClicked === 'cancellation'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Complete cancellation
                    </button>
                  </div>
                </>
              ) : buttonClicked === 'discount' ? (
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Great choice! 🎉
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">
                    {variant === 'B' 
                      ? `Your $${discountAmount} discount has been applied. You'll continue to receive our premium job matching service at just $${discountedPrice.toFixed(2)}/month.`
                      : `Your 50% discount has been applied. You'll continue to receive our premium job matching service at just $${discountedPrice.toFixed(2)}/month.`
                    }
                  </p>
                  <button
                    onClick={() => setButtonClicked(null)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  >
                    Continue
                  </button>
                </div>
              ): null}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1">
          <div className="w-[60%] flex flex-col justify-start px-12 pt-16 pb-6 overflow-y-auto">
            <div className="space-y-6">
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  What's the main reason for cancelling?
                </h2>
                <p className="text-base lg:text-lg text-gray-600">
                  Please take a minute to let us know:
                </p>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="text-red-600 text-base lg:text-lg font-medium space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              )}

              {showError && (
                <div className={`text-red-600 text-base lg:text-lg font-medium transition-all duration-300 ${
                  showError ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  To help us understand your experience, please select a reason for cancelling*
                </div>
              )}

              <div className={`space-y-4 transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
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
                    <span className="text-base lg:text-lg font-medium text-black">{option}</span>
                  </label>
                ))}
              </div>

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
                    `Get $${discountAmount} off | $${discountedPrice.toFixed(2)} <span className="line-through">$${originalPrice.toFixed(2)}</span>`
                  ) : (
                    `Get 50% off | $${discountedPrice.toFixed(2)} <span className="line-through">$${originalPrice.toFixed(2)}</span>`
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

          <div className="w-[40%] flex items-center justify-center px-8 py-8">
            <div className="relative w-full max-w-[320px] h-[400px] rounded-[20px] overflow-hidden shadow-lg">
              <Image
                src="/timo-wagner-fT6-YkB0nfg-unsplash.jpg"
                alt="New York City skyline at twilight with Empire State Building"
                fill
                className={`object-cover object-center transition-all duration-700 ${
                  isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                }`}
                priority
                sizes="(max-width: 1024px) 100vw, 320px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
