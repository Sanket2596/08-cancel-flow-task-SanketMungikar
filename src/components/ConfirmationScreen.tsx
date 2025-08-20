'use client';

import Image from 'next/image';

interface ConfirmationScreenProps {
  onClose: () => void;
  type: 'cancelled' | 'downsell-accepted' | 'downsell-declined';
  originalPrice?: number;
  discountedPrice?: number;
}

export default function ConfirmationScreen({ 
  onClose, 
  type, 
  originalPrice, 
  discountedPrice 
}: ConfirmationScreenProps) {
  const getContent = () => {
    switch (type) {
      case 'cancelled':
        return {
          title: 'Subscription Cancelled',
          message: 'We\'re sorry to see you go. Your subscription has been cancelled and you won\'t be charged again.',
          buttonText: 'Close',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
      case 'downsell-accepted':
        return {
          title: 'Offer Accepted!',
          message: `Great choice! Your subscription is now ${discountedPrice ? `$${(discountedPrice / 100).toFixed(2)}` : 'discounted'} per month. We\'ll help you find that job!`,
          buttonText: 'Continue',
          buttonColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'downsell-declined':
        return {
          title: 'Subscription Cancelled',
          message: 'We understand. Your subscription has been cancelled. If you change your mind, you can always reactivate anytime.',
          buttonText: 'Close',
          buttonColor: 'bg-gray-600 hover:bg-gray-700'
        };
      default:
        return {
          title: 'Thank You',
          message: 'Your request has been processed.',
          buttonText: 'Close',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const content = getContent();

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

        {/* Left Section - Confirmation */}
        <div className="flex-1 flex flex-col justify-center px-12 py-8">
          <div className="space-y-6 text-center">
            {/* Icon */}
            <div className="flex justify-center">
              {type === 'downsell-accepted' ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800">
              {content.title}
            </h2>

            {/* Message */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              {content.message}
            </p>

            {/* Action Button */}
            <button
              onClick={onClose}
              className={`w-full py-4 px-6 text-white font-medium rounded-lg transition-colors duration-200 ${content.buttonColor}`}
            >
              {content.buttonText}
            </button>
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
