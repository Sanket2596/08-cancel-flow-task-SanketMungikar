'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OfferAcceptedScreenProps {
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function OfferAcceptedScreen({
  onClose,
  onBack,
  onContinue,
}: OfferAcceptedScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    console.log('OfferAcceptedScreen component mounted and useEffect triggered');
    setIsVisible(true);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

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
        className={`bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[418px] sm:min-h-[450px] lg:min-h-[418px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform ${
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
          <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">Subscription</h1>

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
          <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6">
              {/* Heading with staggered entrance and responsive text */}
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Great choice, mate!
                </h2>
              </div>

              {/* Sub-heading with delay and responsive sizing */}
              <p className={`text-sm sm:text-base text-gray-600 leading-relaxed transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                You're still on the path to your dream role. <span className="text-[#996EFF] font-semibold">Let's make it happen together!</span>
              </p>

              {/* Subscription Details with delay and responsive sizing */}
              <div className={`space-y-2 transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-sm sm:text-base text-gray-700">
                  You've got <span className="font-semibold">30 days</span> left on your current plan.
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  Starting from <span className="font-semibold">December 1st</span>, your monthly payment will be <span className="font-semibold text-[#996EFF]">$12.50</span>.
                </p>
              </div>

              {/* Cancellation Note with delay and responsive sizing */}
              <p className={`text-xs sm:text-sm text-gray-500 transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                You can cancel anytime before then.
              </p>

              {/* Call to Action Button with responsive sizing */}
              <div className={`pt-2 sm:pt-3 transition-all duration-500 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={onContinue}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-[#996EFF] text-white rounded-lg font-medium transition-all duration-300 hover:bg-[#8A5FFF] hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                  Land your dream role
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
                  Great choice, mate!
                </h2>
              </div>

              {/* Sub-heading with delay */}
              <p className={`text-base lg:text-lg text-gray-600 leading-relaxed max-w-md transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                You're still on the path to your dream role. <span className="text-[#996EFF] font-semibold">Let's make it happen together!</span>
              </p>

              {/* Subscription Details with delay */}
              <div className={`space-y-3 transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-base lg:text-lg text-gray-700">
                  You've got <span className="font-semibold">30 days</span> left on your current plan.
                </p>
                <p className="text-base lg:text-lg text-gray-700">
                  Starting from <span className="font-semibold">December 1st</span>, your monthly payment will be <span className="font-semibold text-[#996EFF]">$12.50</span>.
                </p>
              </div>

              {/* Cancellation Note with delay */}
              <p className={`text-sm text-gray-500 transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                You can cancel anytime before then.
              </p>

              {/* Call to Action Button with enhanced hover effects */}
              <div className={`pt-4 transition-all duration-500 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={onContinue}
                  className="w-full py-4 px-6 bg-[#996EFF] text-white rounded-lg font-medium transition-all duration-300 hover:bg-[#8A5FFF] hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  Land your dream role
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
