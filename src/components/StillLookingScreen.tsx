'use client';

import { useState } from 'react';
import Image from 'next/image';

interface StillLookingScreenProps {
  onClose: () => void;
  onAcceptDownsell: () => void;
  onDeclineDownsell: () => void;
  originalPrice: number; // Price in cents
}

export default function StillLookingScreen({ 
  onClose, 
  onAcceptDownsell, 
  onDeclineDownsell,
  originalPrice 
}: StillLookingScreenProps) {
  const [reason, setReason] = useState('');

  // Calculate discounted price (Variant B: $10 off)
  const discountedPrice = Math.max(originalPrice - 1000, 0); // $10 off, minimum $0
  const originalPriceDollars = (originalPrice / 100).toFixed(2);
  const discountedPriceDollars = (discountedPrice / 100).toFixed(2);

  const handleAcceptDownsell = () => {
    // TODO: Save downsell acceptance to database
    console.log('Downsell accepted, reason:', reason);
    onAcceptDownsell();
  };

  const handleDeclineDownsell = () => {
    // TODO: Save cancellation data to database
    console.log('Downsell declined, reason:', reason);
    onDeclineDownsell();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
      {/* Backdrop with fade-in animation */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-500" />
      
      {/* Modal with slide-up and scale animation */}
      <div className="bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[500px] sm:min-h-[550px] lg:min-h-[433px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden shadow-2xl transition-all duration-500 transform">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-10 bg-white rounded-full shadow-sm hover:scale-110 hover:bg-gray-50"
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

        {/* Mobile and Tablet Layout - Single Column */}
        <div className="lg:hidden flex flex-col h-full">
          {/* City Skyline Image - Mobile and Tablet */}
          <div className="relative w-full h-40 sm:h-48 rounded-t-[20px] overflow-hidden">
            <Image
              src="/empire-state-compressed.jpg"
              alt="New York City skyline at twilight with Empire State Building"
              fill
              className="object-cover object-center transition-all duration-700"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content - Mobile and Tablet */}
          <div className="flex-1 flex flex-col justify-start px-3 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6">
              {/* Heading */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                  Wait! Before you go...
                </h2>
                <h2 className="text-base sm:text-lg lg:text-xl font-medium text-gray-700">
                  We'd love to help you find that job!
                </h2>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg border-2 border-blue-200">
                <div className="text-center space-y-2">
                  <p className="text-xs sm:text-sm text-gray-600">Special offer just for you:</p>
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through">
                      ${originalPriceDollars}
                    </span>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                      ${discountedPriceDollars}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-700 font-medium">
                    That's ${(10).toFixed(2)} off your next month!
                  </p>
                </div>
              </div>

              {/* Feedback Form */}
              <div className="space-y-3 sm:space-y-4">
                <label className="block">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
                    What would help you most right now?
                  </span>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tell us how we can better support your job search..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-sm sm:text-base"
                    rows={3}
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                <button
                  onClick={handleAcceptDownsell}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                  Yes, I'll take the discount!
                </button>
                <button
                  onClick={handleDeclineDownsell}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                  No thanks, I still want to cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="hidden lg:flex flex-1">
          {/* Left Section - Downsell Offer */}
          <div className="flex-1 flex flex-col justify-center px-12 py-8">
            <div className="space-y-6">
              {/* Heading */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Wait! Before you go...
                </h2>
                <h2 className="text-xl font-medium text-gray-700">
                  We'd love to help you find that job!
                </h2>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">Special offer just for you:</p>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl text-gray-400 line-through">
                      ${originalPriceDollars}
                    </span>
                    <span className="text-4xl font-bold text-blue-600">
                      ${discountedPriceDollars}
                    </span>
                  </div>
                  <p className="text-lg text-gray-700 font-medium">
                    That's ${(10).toFixed(2)} off your next month!
                  </p>
                </div>
              </div>

              {/* Feedback Form */}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    What would help you most right now?
                  </span>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tell us how we can better support your job search..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                    rows={2}
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={handleAcceptDownsell}
                  className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Yes, I'll take the discount!
                </button>
                <button
                  onClick={handleDeclineDownsell}
                  className="w-full py-4 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  No thanks, I still want to cancel
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - City Skyline Image */}
          <div className="w-[40%] flex items-center justify-center px-8 py-8">
            <div className="relative w-full max-w-[320px] h-[400px] rounded-[20px] overflow-hidden shadow-lg">
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline at twilight with Empire State Building"
                fill
                className="object-cover object-center transition-all duration-700"
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
