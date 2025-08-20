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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-[1000px] h-[433px] flex relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-10"
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
            <div className="space-y-3">
              <button
                onClick={handleAcceptDownsell}
                className="w-full py-4 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Accept ${discountedPriceDollars} Offer
              </button>
              <button
                onClick={handleDeclineDownsell}
                className="w-full py-4 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
              >
                No thanks, cancel anyway
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex-1 relative">
          <div className="w-full h-full rounded-r-[20px] overflow-hidden">
            <Image
              src="/city-skyline.jpg"
              alt="City skyline with Empire State Building"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
