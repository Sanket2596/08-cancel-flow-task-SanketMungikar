'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Confetti from './Confetti';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobFound: () => void;
  onStillLooking: () => void;
}

export default function CancellationModal({
  isOpen,
  onClose,
  onJobFound,
  onStillLooking,
}: CancellationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      // Add a small delay for the entrance animation
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleJobFound = () => {
    // Trigger confetti celebration
    setShowConfetti(true);
    
    // Wait for confetti to start, then proceed with the flow
    setTimeout(() => {
      onJobFound();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Confetti Component */}
      {showConfetti && <Confetti />}
      
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
          className={`bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[520px] sm:min-h-[500px] lg:min-h-[433px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform ${
            isVisible 
              ? 'translate-y-0 scale-100 opacity-100' 
              : 'translate-y-8 scale-95 opacity-0'
          }`}
        >
          {/* Header - Mobile and Tablet Only */}
          <div className="lg:hidden absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between z-10">
            <h1 className="text-sm sm:text-base font-semibold text-gray-800">Subscription Cancellation</h1>
            <button
              onClick={onClose}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110 hover:bg-gray-100 rounded-full"
            >
              <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" viewBox="0 0 16 16" fill="none">
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

          {/* Close Button - Desktop Only */}
          <button
            onClick={onClose}
            className="hidden lg:flex absolute top-4 right-4 w-8 h-8 items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 bg-white rounded-full shadow-sm hover:scale-110 hover:bg-gray-50 z-10"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

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
                    Hey mate,
                  </h2>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Quick one before you go.
                  </h2>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 italic">
                    Have you found a job yet?
                  </h2>
                </div>

                {/* Descriptive Text with delay and responsive sizing */}
                <p className={`text-sm sm:text-base text-gray-600 leading-relaxed transition-all duration-500 delay-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  Whatever your answer, we just want to help you take the next step.
                  With visa support, or by hearing how we can do better.
                </p>

                {/* Action Buttons with staggered animation and responsive sizing */}
                <div className={`space-y-3 sm:space-y-4 pt-3 sm:pt-4 transition-all duration-500 delay-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <button
                    onClick={handleJobFound}
                    className="w-full py-2.5 sm:py-3 px-4 sm:px-6 border-2 border-gray-300 rounded-lg text-gray-800 font-medium transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                  >
                    Yes, I've found a job 🎉
                  </button>
                  <button
                    onClick={onStillLooking}
                    className="w-full py-2.5 sm:py-3 px-4 sm:px-6 border-2 border-gray-300 rounded-lg text-gray-800 font-medium transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                  >
                    Not yet - I'm still looking
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Two Columns */}
          <div className="hidden lg:flex flex-1">
            {/* Left Section - Text and Buttons (60% width) with staggered animation */}
            <div className="w-[60%] flex flex-col justify-center px-12 py-8">
              <div className="space-y-6">
                {/* Heading with staggered entrance */}
                <div className={`space-y-2 transition-all duration-500 delay-200 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                    Hey mate,
                  </h2>
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                    Quick one before you go.
                  </h2>
                  <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 italic">
                    Have you found a job yet?
                  </h2>
                </div>

                {/* Descriptive Text with delay */}
                <p className={`text-base lg:text-lg text-gray-600 leading-relaxed max-w-md transition-all duration-500 delay-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  Whatever your answer, we just want to help you take the next step.
                  With visa support, or by hearing how we can do better.
                </p>

                {/* Action Buttons with staggered animation and enhanced hover effects */}
                <div className={`space-y-4 pt-4 transition-all duration-500 delay-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  <button
                    onClick={handleJobFound}
                    className="w-full py-3 lg:py-4 px-6 border-2 border-gray-300 rounded-lg text-gray-800 font-medium transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Yes, I've found a job 🎉
                  </button>
                  <button
                    onClick={onStillLooking}
                    className="w-full py-3 lg:py-4 px-6 border-2 border-gray-300 rounded-lg text-gray-800 font-medium transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Not yet - I'm still looking
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
    </>
  );
}
