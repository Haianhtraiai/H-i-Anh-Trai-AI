
import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { key: AppStep.UPLOAD, label: 'Sản Phẩm', icon: 'fa-box' },
    { key: AppStep.CHARACTER, label: 'Nhân Vật', icon: 'fa-user' },
    { key: AppStep.BACKGROUND, label: 'Bối Cảnh', icon: 'fa-image' },
    { key: AppStep.RESULT, label: 'Kết Quả', icon: 'fa-check-circle' },
  ];

  const getStepIndex = (step: AppStep) => {
    if (step === AppStep.GENERATING) return 2.5;
    return steps.findIndex(s => s.key === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 px-4">
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === Math.floor(currentIndex);

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 
                ${isActive ? 'bg-pink-600 border-pink-600 text-white shadow-lg' : 'bg-white border-gray-300 text-gray-400'}`}
              >
                <i className={`fas ${step.icon} text-sm`}></i>
              </div>
              <span className={`mt-2 text-xs font-semibold ${isActive ? 'text-pink-600' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-2 -mt-6">
                <div 
                  className="h-full bg-pink-600 transition-all duration-500" 
                  style={{ width: index < currentIndex ? '100%' : '0%' }}
                ></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
