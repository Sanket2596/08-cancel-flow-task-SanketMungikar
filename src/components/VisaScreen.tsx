'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface VisaScreenProps {
  onClose: () => void;
  onBack: () => void;
  onComplete: () => void;
}

export default function VisaScreen({
  onClose,
  onBack,
  onComplete,
}: VisaScreenProps) {
  const [hasImmigrationLawyer, setHasImmigrationLawyer] = useState<string>('');
  const [visaType, setVisaType] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [needsVisaHelp, setNeedsVisaHelp] = useState<boolean>(false);

  // Form validation: requires immigration lawyer selection and visa type (always required now)
  const isFormValid = hasImmigrationLawyer !== '' && visaType.trim().length > 0;

  useEffect(() => {
    setIsVisible(true);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRadioChange = (value: string) => {
    setHasImmigrationLawyer(value);
    // Set visa help flag based on selection
    setNeedsVisaHelp(value === 'no');
    // Clear visa type when switching to "No" to ensure fresh input
    if (value === 'no') {
      setVisaType('');
    }
  };

  // Add a function to reset selection if user wants to change their mind
  const handleResetSelection = () => {
    setHasImmigrationLawyer('');
    setVisaType('');
    setNeedsVisaHelp(false);
  };

  const handleVisaTypeChange = (value: string) => {
    setVisaType(value);
  };

  const handleComplete = () => {
    setShowCompletionScreen(true);
  };

  const handleBackToForm = () => {
    setShowCompletionScreen(false);
  };

  // Show completion screen
  if (showCompletionScreen) {
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
          className={`bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[371px] sm:min-h-[400px] lg:min-h-[450px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform ${
            isVisible 
              ? 'translate-y-0 scale-100 opacity-100' 
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          {/* Top Bar - Header */}
          <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
            {/* Back Button */}
            <button
              onClick={handleBackToForm}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Back</span>
            </button>

            {/* Title */}
            <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">Subscription Cancelled</h1>

            {/* Progress Indicator - Completed */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5 sm:ml-2">Completed</span>
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
                src="/skyline_image.jpg"
                alt="City skyline with Empire State Building"
                fill
                className={`object-cover object-center transition-all duration-700 ${
                  isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                }`}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content - Mobile and Tablet with responsive spacing */}
            <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-16 sm:pt-20 pb-4 sm:pb-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Heading with staggered entrance and responsive text */}
                <div className={`space-y-2 transition-all duration-500 delay-200 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    {needsVisaHelp 
                      ? "Your cancellation's all sorted, mate, no more charges."
                      : "All done, your cancellation's been processed."
                    }
                  </h2>
                </div>

                {/* Conditional Content based on visa help needs */}
                {needsVisaHelp ? (
                  /* Contact Card with Mihailo Bozic - when visa help is needed */
                  <div className={`transition-all duration-500 delay-300 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-2xl">M</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">Mihailo Bozic</p>
                          <p className="text-base text-gray-600">mihailo@migratemate.co</p>
                        </div>
                      </div>
                      <div className="space-y-3 text-base text-gray-700">
                        <p>I'll be reaching out soon to help with the visa side of things.</p>
                        <p>We've got your back, whether it's questions, paperwork, or just figuring out your options.</p>
                        <p>Keep an eye on your inbox, I'll be in touch <span className="underline">shortly</span>.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Simple completion message - when no visa help is needed */
                  <div className={`transition-all duration-500 delay-300 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <div className="space-y-3 text-base text-gray-700">
                      <p>We're stoked to hear you've landed a job and sorted your visa.</p>
                      <p>Big congrats from the team. 🙌</p>
                    </div>
                  </div>
                )}

                {/* Finish Button with responsive sizing */}
                <div className={`pt-3 sm:pt-4 transition-all duration-500 delay-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <button
                    onClick={onComplete}
                    className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-[#8952fc] text-white rounded-lg font-medium transition-all duration-300 hover:bg-[#7b40fc] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                  >
                    Finish
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Two Columns */}
          <div className="hidden lg:flex flex-1">
            {/* Left Section - Content (60% width) with staggered animation */}
            <div className="w-[60%] flex flex-col justify-center px-12 py-8">
              <div className="space-y-6">
                {/* Heading with staggered entrance */}
                <div className={`space-y-2 transition-all duration-500 delay-200 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {needsVisaHelp 
                      ? "Your cancellation's all sorted, mate, no more charges."
                      : "All done, your cancellation's been processed."
                    }
                  </h2>
                </div>

                {/* Conditional Content based on visa help needs */}
                {needsVisaHelp ? (
                  /* Contact Card with Mihailo Bozic - when visa help is needed */
                  <div className={`transition-all duration-500 delay-300 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-2xl">M</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">Mihailo Bozic</p>
                          <p className="text-base text-gray-600">mihailo@migratemate.co</p>
                        </div>
                      </div>
                      <div className="space-y-3 text-base text-gray-700">
                        <p>I'll be reaching out soon to help with the visa side of things.</p>
                        <p>We've got your back, whether it's questions, paperwork, or just figuring out your options.</p>
                        <p>Keep an eye on your inbox, I'll be in touch <span className="underline">shortly</span>.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Simple completion message - when no visa help is needed */
                  <div className={`transition-all duration-500 delay-300 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <div className="space-y-3 text-base text-gray-700">
                      <p>We're stoked to hear you've landed a job and sorted your visa.</p>
                      <p>Big congrats from the team. 🙌</p>
                    </div>
                  </div>
                )}

                {/* Finish Button with responsive sizing */}
                <div className={`pt-3 sm:pt-4 transition-all duration-500 delay-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <button
                    onClick={onComplete}
                    className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-[#8952fc] text-white rounded-lg font-medium transition-all duration-300 hover:bg-[#7b40fc] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                  >
                    Finish
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - City Skyline Image (40% width) with proper containment */}
            <div className="w-[40%] flex items-center justify-center px-8 py-8">
              <div className="relative w-full max-w-[320px] h-[400px] rounded-[20px] overflow-hidden shadow-lg">
                <Image
                  src="/skyline_image.jpg"
                  alt="City skyline with Empire State Building"
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

  // Show the original visa form
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
        className={`bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[371px] sm:min-h-[400px] lg:min-h-[450px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform ${
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

          {/* Progress Indicator */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-2 bg-gray-300 rounded-sm"></div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 ml-1.5 sm:ml-2">Step 3 of 3</span>
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
              src="/skyline_image.jpg"
              alt="City skyline with Empire State Building"
              fill
              className={`object-cover object-center transition-all duration-700 ${
                isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              }`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content - Mobile and Tablet with responsive spacing */}
          <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-16 sm:pt-20 pb-4 sm:pb-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Heading with staggered entrance and responsive text */}
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  You landed the job!
                </h2>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 italic">
                  That's what we live for.
                </h2>
              </div>

              {/* Introductory Text with delay and responsive sizing */}
              <p className={`text-sm sm:text-base text-gray-600 leading-relaxed transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                Even if it wasn't through Migrate Mate, let us help get your visa sorted.
              </p>

              {/* Question 1 with delay and responsive sizing */}
              <div className={`transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  Is your company providing an immigration lawyer to help with your visa?
                </p>
              </div>

              {/* Radio Buttons with staggered animation and responsive sizing */}
              <div className={`space-y-3 transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {/* Show "Yes" option only when "No" is explicitly selected */}
                {hasImmigrationLawyer !== 'no' && (
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="immigrationLawyer"
                      value="yes"
                      checked={hasImmigrationLawyer === 'yes'}
                      onChange={() => handleRadioChange('yes')}
                      className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="text-sm sm:text-base text-gray-800 group-hover:text-gray-900 transition-colors">Yes</span>
                  </label>
                )}
                
                {/* Show "No" option only when "Yes" is explicitly selected */}
                {hasImmigrationLawyer !== 'yes' && (
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="immigrationLawyer"
                      value="no"
                      checked={hasImmigrationLawyer === 'no'}
                      onChange={() => handleRadioChange('no')}
                      className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="text-sm sm:text-base text-gray-800 group-hover:text-gray-900 transition-colors">No</span>
                  </label>
                )}

                {/* Reset button - shows when a selection is made */}
                {hasImmigrationLawyer !== '' && (
                  <div className={`pt-2 transition-all duration-500 delay-600 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <button
                      onClick={handleResetSelection}
                      className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
                    >
                      Change selection
                    </button>
                  </div>
                )}
              </div>

              {/* Conditional Text for "No" selection */}
              {hasImmigrationLawyer === 'no' && (
                <div className={`transition-all duration-500 delay-600 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We can connect you with one of our trusted partners.
                  </p>
                </div>
              )}

              {/* Visa Question - Always visible */}
              <div className={`transition-all duration-500 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  Which visa would you like to apply for?*
                </p>
              </div>

              {/* Visa Type Input - Always visible */}
              <div className={`transition-all duration-500 delay-800 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <input
                  type="text"
                  value={visaType}
                  onChange={(e) => handleVisaTypeChange(e.target.value)}
                  placeholder="Enter visa type..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              {/* Complete Cancellation Button with responsive sizing */}
              <div className={`pt-3 sm:pt-4 transition-all duration-500 delay-900 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={handleComplete}
                  disabled={!isFormValid}
                  className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                    isFormValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
          {/* Left Section - Form (60% width) with staggered animation */}
          <div className="w-[60%] flex flex-col justify-start px-12 pt-16 pb-6">
            <div className="space-y-6">
              {/* Heading with staggered entrance */}
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  You landed the job!
                </h2>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 italic">
                  That's what we live for.
                </h2>
              </div>

              {/* Introductory Text with delay */}
              <p className={`text-base lg:text-lg text-gray-600 leading-relaxed max-w-md transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                Even if it wasn't through Migrate Mate, let us help get your visa sorted.
              </p>

              {/* Question 1 with delay */}
              <div className={`transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-base lg:text-lg text-gray-700 font-medium">
                  Is your company providing an immigration lawyer to help with your visa?
                </p>
              </div>

              {/* Radio Buttons with staggered animation */}
              <div className={`space-y-4 transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {/* Show "Yes" option only when "No" is explicitly selected */}
                {hasImmigrationLawyer !== 'no' && (
                  <label className="flex items-center space-x-4 cursor-pointer group">
                    <input
                      type="radio"
                      name="immigrationLawyer"
                      value="yes"
                      checked={hasImmigrationLawyer === 'yes'}
                      onChange={() => handleRadioChange('yes')}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="text-lg text-gray-800 group-hover:text-gray-900 transition-colors">Yes</span>
                  </label>
                )}
                
                {/* Show "No" option only when "Yes" is explicitly selected */}
                {hasImmigrationLawyer !== 'yes' && (
                  <label className="flex items-center space-x-4 cursor-pointer group">
                    <input
                      type="radio"
                      name="immigrationLawyer"
                      value="no"
                      checked={hasImmigrationLawyer === 'no'}
                      onChange={() => handleRadioChange('no')}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    />
                    <span className="text-lg text-gray-800 group-hover:text-gray-900 transition-colors">No</span>
                  </label>
                )}

                {/* Reset button - shows when a selection is made */}
                {hasImmigrationLawyer !== '' && (
                  <div className={`pt-2 transition-all duration-500 delay-600 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                    <button
                      onClick={handleResetSelection}
                      className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                    >
                      Change selection
                    </button>
                  </div>
                )}
              </div>

              {/* Conditional Text for "No" selection */}
              {hasImmigrationLawyer === 'no' && (
                <div className={`transition-all duration-500 delay-600 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                    We can connect you with one of our trusted partners.
                  </p>
                </div>
              )}

              {/* Visa Question - Always visible */}
              <div className={`transition-all duration-500 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-base lg:text-lg text-gray-700 font-medium">
                  Which visa would you like to apply for?*
                </p>
              </div>

              {/* Visa Type Input - Always visible */}
              <div className={`transition-all duration-500 delay-800 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <input
                  type="text"
                  value={visaType}
                  onChange={(e) => handleVisaTypeChange(e.target.value)}
                  placeholder="Enter visa type..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              {/* Complete Cancellation Button with enhanced hover effects */}
              <div className={`pt-6 transition-all duration-500 delay-900 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={handleComplete}
                  disabled={!isFormValid}
                  className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 ${
                    isFormValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Complete cancellation
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - City Skyline Image (40% width) with proper containment */}
          <div className="w-[40%] flex items-center justify-center px-8 py-8">
            <div className="relative w-full max-w-[320px] h-[400px] rounded-[20px] overflow-hidden shadow-lg">
              <Image
                src="/skyline_image.jpg"
                alt="City skyline with Empire State Building"
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