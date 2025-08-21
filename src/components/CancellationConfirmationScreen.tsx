'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CancellationConfirmationScreenProps {
  onClose: () => void;
  onBackToJobs: () => void;
}

export default function CancellationConfirmationScreen({
  onClose,
  onBackToJobs,
}: CancellationConfirmationScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get current date and add 30 days for subscription end date
  const getSubscriptionEndDate = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    return endDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackToJobs = () => {
    setIsVisible(false);
    setTimeout(() => {
      onBackToJobs();
    }, 300);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
      {/* Backdrop with fade-in animation */}
      <div
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
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
            onClick={handleClose}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Back</span>
          </button>

          {/* Title and Progress */}
          <div className="flex items-center space-x-3">
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">Subscription Cancelled</span>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-2 bg-green-500 rounded-sm"></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5 sm:ml-2">Completed</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
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
          <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-y-auto">
            <div className="flex-1 flex flex-col justify-center space-y-6">
              {/* Main Heading */}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Sorry to see you go, mate.
              </h2>

              {/* Sub-heading */}
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                Thanks for being with us, and you're always welcome back.
              </p>

              {/* Subscription Details */}
              <div className="space-y-2">
                <p className="text-sm sm:text-base text-gray-700">
                  Your subscription is set to end on {getSubscriptionEndDate()}.
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  You'll still have full access until then. No further charges after that.
                </p>
              </div>

              {/* Reactivation Prompt */}
              <p className="text-sm sm:text-base text-gray-700">
                Changed your mind? You can reactivate anytime before your end date.
              </p>

              {/* Back to Jobs Button */}
              <button
                onClick={handleBackToJobs}
                className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="hidden lg:flex flex-1">
          {/* Left Section - Content (60% width) */}
          <div className="w-[60%] flex flex-col justify-start px-12 pt-16 pb-6 overflow-y-auto">
            <div className="space-y-8">
              {/* Main Heading */}
              <div className={`space-y-2 transition-all duration-500 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
                  Sorry to see you go, mate.
                </h2>
              </div>

              {/* Sub-heading */}
              <div className={`transition-all duration-500 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  Thanks for being with us, and you're always welcome back.
                </p>
              </div>

              {/* Subscription Details */}
              <div className={`space-y-3 transition-all duration-500 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-lg lg:text-xl text-gray-700">
                  Your subscription is set to end on {getSubscriptionEndDate()}.
                </p>
                <p className="text-lg lg:text-xl text-gray-700">
                  You'll still have full access until then. No further charges after that.
                </p>
              </div>

              {/* Reactivation Prompt */}
              <div className={`transition-all duration-500 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-lg lg:text-xl text-gray-700">
                  Changed your mind? You can reactivate anytime before your end date.
                </p>
              </div>

              {/* Back to Jobs Button */}
              <div className={`transition-all duration-500 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  onClick={handleBackToJobs}
                  className="w-full py-4 px-8 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-lg lg:text-xl"
                >
                  Back to Jobs
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - City Skyline Image (40% width) with proper positioning */}
          <div className="w-[40%] flex items-center justify-center px-8 py-8">
            <div className="relative w-full max-w-[320px] h-[404px] rounded-[20px] overflow-hidden shadow-lg">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline at twilight with Empire State Building prominently featured"
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
