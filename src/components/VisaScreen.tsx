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

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
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

  const handleVisaTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisaType(event.target.value);
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
          className={`bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform ${
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
              src="/empire-state-compressed.jpg"
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
           <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-24 sm:pt-28 pb-4 sm:pb-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Heading with staggered entrance and responsive text */}
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                                 <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
                   Your cancellation's all sorted, mate, no more charges.
                 </h2>
              </div>

              {/* Simple completion message */}
              <div className={`transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="space-y-3 text-base text-gray-700 pt-2">
                  <p>We're stoked to hear you've landed a job and sorted your visa.</p>
                  <p>Big congrats from the team. 🙌</p>
                </div>
              </div>

              {/* Mihailo Contact Information */}
              <div className={`transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="bg-gray-100 rounded-lg p-4 space-y-3 mt-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src="/mihailo-profile.jpeg"
                        alt="Mihailo Bozic"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Mihailo Bozic</p>
                      <p className="text-xs text-gray-600">mihailo@migratemate.co</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>I'll be reaching out soon to help with the visa side of things.</p>
                    <p>We've got your back, whether it's questions, paperwork, or just figuring out your options.</p>
                    <p>Keep an eye on your inbox, I'll be in touch <span className="underline">shortly</span>.</p>
                  </div>
                </div>
              </div>

                {/* Finish Button with responsive sizing */}
                <div className={`pt-3 sm:pt-4 transition-all duration-500 delay-500 ${
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
             <div className="w-[60%] flex flex-col justify-center px-12 py-16">
              <div className="space-y-6">
                {/* Heading with staggered entrance */}
                <div className={`space-y-2 transition-all duration-500 delay-200 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                    Your cancellation's all sorted, mate, no more charges.
                  </h2>
                </div>

                {/* Simple completion message */}
                <div className={`transition-all duration-500 delay-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <div className="space-y-3 text-base text-gray-700 pt-2">
                    <p>We're stoked to hear you've landed a job and sorted your visa.</p>
                    <p>Big congrats from the team. 🙌</p>
                  </div>
                </div>

                {/* Mihailo Contact Information */}
                <div className={`transition-all duration-500 delay-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <div className="bg-gray-100 rounded-lg p-4 space-y-3 mt-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src="/mihailo-profile.jpeg"
                          alt="Mihailo Bozic"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Mihailo Bozic</p>
                        <p className="text-xs text-gray-600">mihailo@migratemate.co</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-gray-700">
                      <p>I'll be reaching out soon to help with the visa side of things.</p>
                      <p>We've got your back, whether it's questions, paperwork, or just figuring out your options.</p>
                      <p>Keep an eye on your inbox, I'll be in touch <span className="underline">shortly</span>.</p>
                    </div>
                  </div>
                </div>

                {/* Finish Button with responsive sizing */}
                <div className={`pt-3 sm:pt-4 transition-all duration-500 delay-500 ${
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
                  src="/empire-state-compressed.jpg"
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
              src="/empire-state-image.jpg"
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
          <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6">
              {/* Heading with staggered entrance and responsive text */}
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Do you need help with visa support?
                </h2>
              </div>

              {/* Introductory text with delay and responsive sizing */}
              <p className={`text-sm sm:text-base text-gray-600 leading-relaxed transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                We understand that visa processes can be complex. Let us know if you need assistance.
              </p>

              {/* Radio Button Options with responsive sizing */}
              <div className={`space-y-3 transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {hasImmigrationLawyer !== 'no' && (
                  <label className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="hasImmigrationLawyer"
                      value="yes"
                      checked={hasImmigrationLawyer === 'yes'}
                      onChange={handleRadioChange}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#996EFF] border-gray-300 focus:ring-2 focus:ring-[#996EFF]"
                    />
                    <span className="text-sm sm:text-base font-medium text-gray-700">Yes</span>
                  </label>
                )}

                {hasImmigrationLawyer !== 'yes' && (
                  <label className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="hasImmigrationLawyer"
                      value="no"
                      checked={hasImmigrationLawyer === 'no'}
                      onChange={handleRadioChange}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#996EFF] border-gray-300 focus:ring-2 focus:ring-[#996EFF]"
                    />
                    <span className="text-sm sm:text-base font-medium text-gray-700">No</span>
                  </label>
                )}

                {/* Reset button */}
                {hasImmigrationLawyer !== '' && (
                  <button
                    onClick={handleResetSelection}
                    className="text-xs sm:text-sm text-[#996EFF] hover:text-[#8A5FFF] transition-colors duration-200 underline"
                  >
                    Change selection
                  </button>
                )}
              </div>

              {/* Visa Type Question - Always visible */}
              <div className={`space-y-2 sm:space-y-3 transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  What type of visa are you applying for?*
                </label>
                <input
                  type="text"
                  value={visaType}
                  onChange={handleVisaTypeChange}
                  placeholder="e.g., H-1B, L-1, O-1, etc."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#996EFF] focus:border-[#996EFF] transition-all duration-200"
                />
              </div>

              {/* Continue Button with responsive sizing */}
              <div className={`pt-2 sm:pt-3 transition-all duration-500 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={handleComplete}
                  disabled={!isFormValid}
                  className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                    isFormValid
                      ? 'bg-[#996EFF] text-white hover:bg-[#8A5FFF] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
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
                  Do you need help with visa support?
                </h2>
              </div>

              {/* Introductory text with delay */}
              <p className={`text-base lg:text-lg text-gray-600 leading-relaxed max-w-md transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                We understand that visa processes can be complex. Let us know if you need assistance.
              </p>

              {/* Radio Button Options with delay */}
              <div className={`space-y-4 transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {hasImmigrationLawyer !== 'no' && (
                  <label className="flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="hasImmigrationLawyer"
                      value="yes"
                      checked={hasImmigrationLawyer === 'yes'}
                      onChange={handleRadioChange}
                      className="w-5 h-5 text-[#996EFF] border-gray-300 focus:ring-2 focus:ring-[#996EFF]"
                    />
                    <span className="text-base lg:text-lg font-medium text-gray-700">Yes</span>
                  </label>
                )}

                {hasImmigrationLawyer !== 'yes' && (
                  <label className="flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50">
                    <input
                      type="radio"
                      name="hasImmigrationLawyer"
                      value="no"
                      checked={hasImmigrationLawyer === 'no'}
                      onChange={handleRadioChange}
                      className="w-5 h-5 text-[#996EFF] border-gray-300 focus:ring-2 focus:ring-[#996EFF]"
                    />
                    <span className="text-base lg:text-lg font-medium text-gray-700">No</span>
                  </label>
                )}

                {/* Reset button */}
                {hasImmigrationLawyer !== '' && (
                  <button
                    onClick={handleResetSelection}
                    className="text-sm text-[#996EFF] hover:text-[#8A5FFF] transition-colors duration-200 underline"
                  >
                    Change selection
                  </button>
                )}
              </div>

              {/* Visa Type Question - Always visible */}
              <div className={`space-y-3 transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="text-base lg:text-lg font-medium text-gray-700">
                  What type of visa are you applying for?*
                </label>
                <input
                  type="text"
                  value={visaType}
                  onChange={handleVisaTypeChange}
                  placeholder="e.g., H-1B, L-1, O-1, etc."
                  className="w-full px-4 py-3 text-base lg:text-lg text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#996EFF] focus:border-[#996EFF] transition-all duration-200"
                />
              </div>

              {/* Continue Button with enhanced hover effects */}
              <div className={`pt-4 transition-all duration-500 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={handleComplete}
                  disabled={!isFormValid}
                  className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 ${
                    isFormValid
                      ? 'bg-[#996EFF] text-white hover:bg-[#8A5FFF] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]'
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
                src="/empire-state-compressed.jpg"
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