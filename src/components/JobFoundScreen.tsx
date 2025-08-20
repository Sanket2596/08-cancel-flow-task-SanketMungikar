'use client';

import { useState } from 'react';
import Image from 'next/image';

interface JobFoundScreenProps {
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function JobFoundScreen({ onClose, onBack, onContinue }: JobFoundScreenProps) {
  const [formData, setFormData] = useState({
    foundWithMigrateMate: '',
    rolesApplied: '',
    companiesEmailed: '',
    companiesInterviewed: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // TODO: Save form data to database
    console.log('Form data:', formData);
    onContinue();
  };

  const isFormValid = formData.foundWithMigrateMate && formData.rolesApplied && 
                     formData.companiesEmailed && formData.companiesInterviewed;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-[20px] w-full max-w-[320px] sm:max-w-[480px] md:max-w-[640px] lg:max-w-[1000px] h-auto min-h-[520px] sm:min-h-[500px] lg:min-h-[500px] max-h-[90vh] flex flex-col lg:flex-row relative overflow-hidden">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-xs sm:text-sm lg:text-base"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-1.5 lg:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Title */}
          <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 text-center flex-1 mx-2">Subscription Cancellation</h1>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full"></div>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-1.5 lg:ml-2 hidden sm:inline">Step 1 of 3</span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors ml-1 sm:ml-2"
          >
            <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" viewBox="0 0 16 16" fill="none">
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
              className="object-cover object-center"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Form Content - Mobile and Tablet with responsive spacing */}
          <div className="flex-1 flex flex-col justify-start px-3 sm:px-4 pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-y-auto">
            <div className="space-y-4 sm:space-y-6">
              {/* Heading with responsive text sizing */}
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
                  Congrats on the new role! 🎉
                </h2>
              </div>

              {/* Question 1 with responsive spacing */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
                    Did you find this job with MigrateMate?*
                  </span>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleInputChange('foundWithMigrateMate', 'yes')}
                      className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${
                        formData.foundWithMigrateMate === 'yes'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleInputChange('foundWithMigrateMate', 'no')}
                      className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${
                        formData.foundWithMigrateMate === 'no'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </label>
              </div>

              {/* Question 2 with responsive grid */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
                    How many roles did you apply for through Migrate Mate?*
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {['0', '1-5', '6-20', '20+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('rolesApplied', option)}
                        className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border-2 transition-all duration-200 text-xs sm:text-sm ${
                          formData.rolesApplied === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              {/* Question 3 with responsive grid */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
                    How many companies did you email directly?*
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {['0', '1-5', '6-20', '20+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('companiesEmailed', option)}
                        className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border-2 transition-all duration-200 text-xs sm:text-sm ${
                          formData.companiesEmailed === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              {/* Question 4 with responsive grid */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
                    How many different companies did you interview with?*
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {['0', '1-2', '3-5', '5+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('companiesInterviewed', option)}
                        className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border-2 transition-all duration-200 text-xs sm:text-sm ${
                          formData.companiesInterviewed === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              {/* Continue Button with responsive sizing */}
              <div className="pt-3 sm:pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    isFormValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
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
          {/* Left Section - Form */}
          <div className="flex-1 flex flex-col justify-start px-12 pt-16 pb-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Heading */}
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center">
                  Congrats on the new role! 🎉
                </h2>
              </div>

              {/* Question 1 */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-3 block">
                    Did you find this job with MigrateMate?*
                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleInputChange('foundWithMigrateMate', 'yes')}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.foundWithMigrateMate === 'yes'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleInputChange('foundWithMigrateMate', 'no')}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        formData.foundWithMigrateMate === 'no'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </label>
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-3 block">
                    How many roles did you apply for through Migrate Mate?*
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {['0', '1-5', '6-20', '20+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('rolesApplied', option)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.rolesApplied === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-3 block">
                    How many companies did you email directly?*
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {['0', '1-5', '6-20', '20+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('companiesEmailed', option)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.companiesEmailed === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              {/* Question 4 */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-3 block">
                    How many different companies did you interview with?*
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {['0', '1-2', '3-5', '5+'].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('companiesInterviewed', option)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                          formData.companiesInterviewed === option
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
                    isFormValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - City Skyline Image */}
          <div className="flex-1 relative min-h-[500px] w-full">
            <div className="w-full h-full rounded-r-[20px] overflow-hidden">
              <Image
                src="/skyline_image.jpg"
                alt="City skyline with Empire State Building"
                fill
                className="object-cover object-center"
                priority
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
