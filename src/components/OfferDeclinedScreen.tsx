'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OfferDeclinedScreenProps {
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function OfferDeclinedScreen({
  onClose,
  onBack,
  onContinue,
}: OfferDeclinedScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Form state for the three questions
  const [formData, setFormData] = useState({
    rolesApplied: '',
    companiesEmailed: '',
    companiesInterviewed: ''
  });

  useEffect(() => {
    console.log('OfferDeclinedScreen component mounted and useEffect triggered');
    setIsVisible(true);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleOptionSelect = (question: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const isFormValid = formData.rolesApplied && formData.companiesEmailed && formData.companiesInterviewed;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
      {/* Backdrop with fade-in animation */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal with slide-up and scale animation */}
      <div
        className={`bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[500px] sm:min-h-[550px] lg:min-h-[500px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-8 scale-95 opacity-0'
        }`}
      >
        {/* Top Bar - Header */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
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

          {/* Title */}
          <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">Subscription Cancellation</h1>

          {/* Progress Indicator - Step 2 of 3 */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-gray-300 rounded-sm"></div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 ml-1.5 sm:ml-2">Step 2 of 3</span>
          </div>

          {/* Close Button */}
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

        {/* Mobile and Tablet Layout - Single Column */}
        <div className="lg:hidden flex flex-col h-full">
          {/* City Skyline Image - Mobile and Tablet */}
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

          {/* Content - Mobile and Tablet with responsive spacing */}
          <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6">
              {/* Heading with staggered entrance and responsive text */}
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Help us understand how you were using Migrate Mate.
                </h2>
              </div>

              {/* Progress Indicator with delay and responsive sizing */}
              <div className={`space-y-2 transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {Object.values(formData).filter(Boolean).length} of 3 questions answered
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {Math.round((Object.values(formData).filter(Boolean).length / 3) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#996EFF] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.values(formData).filter(Boolean).length / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question 1 with responsive sizing */}
              <div className={`space-y-2 sm:space-y-3 transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  How many roles did you apply for through Migrate Mate?*
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['0', '1-5', '6-20', '20+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('rolesApplied', option)}
                      className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border-2 transition-all duration-200 text-xs sm:text-sm ${
                        formData.rolesApplied === option
                          ? 'border-[#996EFF] bg-[#996EFF]/5 text-[#996EFF]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 with responsive sizing */}
              <div className={`space-y-2 sm:space-y-3 transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  How many companies did you email directly?*
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['0', '1-5', '6-20', '20+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('companiesEmailed', option)}
                      className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border-2 transition-all duration-200 text-xs sm:text-sm ${
                        formData.companiesEmailed === option
                          ? 'border-[#996EFF] bg-[#996EFF]/5 text-[#996EFF]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 with responsive sizing */}
              <div className={`space-y-2 sm:space-y-3 transition-all duration-500 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  How many different companies did you interview with?*
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['0', '1-2', '3-5', '5+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('companiesInterviewed', option)}
                      className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border-2 transition-all duration-200 text-xs sm:text-sm ${
                        formData.companiesInterviewed === option
                          ? 'border-[#996EFF] bg-[#996EFF]/5 text-[#996EFF]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Helpful Hint Text with delay and responsive sizing */}
              <div className={`transition-all duration-500 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className={`text-xs sm:text-sm text-center ${
                  isFormValid ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {isFormValid 
                    ? '✅ All questions answered! You can now continue.' 
                    : 'Please answer all questions above to continue'
                  }
                </p>
              </div>

              {/* Action Buttons with responsive sizing */}
              <div className={`space-y-3 pt-2 sm:pt-3 transition-all duration-500 delay-800 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                                 {/* Primary Button: Get 50% off */}
                 <button
                   onClick={onContinue}
                   className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-green-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-green-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                 >
                   Get 50% off | $12.50 <span className="line-through">$25</span>
                 </button>

                {/* Secondary Button: Continue */}
                <button
                  onClick={onContinue}
                  disabled={!isFormValid}
                  className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                    isFormValid
                      ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="hidden lg:flex flex-1">
          {/* Left Section - Content (60% width) with staggered animation */}
          <div className="w-[60%] flex flex-col justify-start px-12 pt-16 pb-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Heading with staggered entrance */}
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  Help us understand how you were using Migrate Mate.
                </h2>
              </div>

              {/* Progress Indicator with delay */}
              <div className={`space-y-3 transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-base lg:text-lg text-gray-600">
                    {Object.values(formData).filter(Boolean).length} of 3 questions answered
                  </span>
                  <span className="text-base lg:text-lg text-gray-500">
                    {Math.round((Object.values(formData).filter(Boolean).length / 3) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#996EFF] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.values(formData).filter(Boolean).length / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question 1 with delay */}
              <div className={`space-y-3 transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="text-base lg:text-lg font-medium text-gray-700">
                  How many roles did you apply for through Migrate Mate?*
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['0', '1-5', '6-20', '20+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('rolesApplied', option)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.rolesApplied === option
                          ? 'border-[#996EFF] bg-[#996EFF]/5 text-[#996EFF]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 with delay */}
              <div className={`space-y-3 transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="text-base lg:text-lg font-medium text-gray-700">
                  How many companies did you email directly?*
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['0', '1-5', '6-20', '20+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('companiesEmailed', option)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.companiesEmailed === option
                          ? 'border-[#996EFF] bg-[#996EFF]/5 text-[#996EFF]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 with delay */}
              <div className={`space-y-3 transition-all duration-500 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="text-base lg:text-lg font-medium text-gray-700">
                  How many different companies did you interview with?*
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['0', '1-2', '3-5', '5+'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect('companiesInterviewed', option)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.companiesInterviewed === option
                          ? 'border-[#996EFF] bg-[#996EFF]/5 text-[#996EFF]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Helpful Hint Text with delay */}
              <div className={`transition-all duration-500 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className={`text-sm text-center ${
                  isFormValid ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {isFormValid 
                    ? '✅ All questions answered! You can now continue.' 
                    : 'Please answer all questions above to continue'
                  }
                </p>
              </div>

              {/* Action Buttons with enhanced hover effects */}
              <div className={`space-y-4 pt-4 transition-all duration-500 delay-800 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                                 {/* Primary Button: Get 50% off */}
                 <button
                   onClick={onContinue}
                   className="w-full py-4 px-6 bg-green-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-green-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                 >
                   Get 50% off | $12.50 <span className="line-through">$25</span>
                 </button>

                {/* Secondary Button: Continue */}
                <button
                  onClick={onContinue}
                  disabled={!isFormValid}
                  className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 ${
                    isFormValid
                      ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - City Skyline Image (40% width) with proper containment */}
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
