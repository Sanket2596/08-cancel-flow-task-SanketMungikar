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
          <div className="flex-1 flex flex-col justify-center px-3 sm:px-6 py-4 sm:py-6">
            <div className="space-y-4 sm:space-y-6 text-center">
              {/* Icon */}
              <div className="flex justify-center">
                {type === 'downsell-accepted' ? (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                {content.title}
              </h2>

              {/* Message */}
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                {content.message}
              </p>

              {/* Action Button */}
              <button
                onClick={onClose}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base ${content.buttonColor}`}
              >
                {content.buttonText}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two Columns */}
        <div className="hidden lg:flex flex-1">
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
                className={`w-full py-4 px-6 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${content.buttonColor}`}
              >
                {content.buttonText}
              </button>
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
