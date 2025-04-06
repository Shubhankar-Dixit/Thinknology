import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentIndex: number;
  totalSteps: number;
  labels?: string[];
  onNavigate?: (index: number) => void;
  allowNavigation?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentIndex,
  totalSteps,
  labels,
  onNavigate,
  allowNavigation = false
}) => {
  const handleStepClick = (index: number) => {
    if (allowNavigation && onNavigate && index <= currentIndex) {
      onNavigate(index);
    }
  };

  return (
    <div className="progress-indicator w-full py-4">
      <div className="relative flex justify-between items-center w-full">
        {/* Progress bar background */}
        <div className="absolute h-1 bg-tertiary/30 w-full rounded-full"/>
        
        {/* Animated progress */}
        <motion.div 
          className="absolute h-1 bg-accent rounded-full"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${(currentIndex / (totalSteps - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* Step indicators */}
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div 
            key={index}
            className={`
              relative flex flex-col items-center justify-center z-10 rounded-full
              ${allowNavigation && index <= currentIndex ? 'cursor-pointer' : 'cursor-default'}
            `}
            onClick={() => handleStepClick(index)}
            whileHover={allowNavigation && index <= currentIndex ? { scale: 1.1 } : {}}
            whileTap={allowNavigation && index <= currentIndex ? { scale: 0.95 } : {}}
          >
            <motion.div 
              className={`
                w-5 h-5 rounded-full flex items-center justify-center
                ${index < currentIndex 
                  ? 'bg-accent border-2 border-accent text-white' 
                  : index === currentIndex 
                    ? 'bg-accent border-2 border-accent text-white' 
                    : 'bg-tertiary/20 border-2 border-tertiary/40'
                }
              `}
              initial={false}
              animate={
                index <= currentIndex 
                  ? { scale: [null, 1.3, 1], backgroundColor: "#var(--color-accent)" } 
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              {index < currentIndex && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </motion.div>
            
            {labels && labels[index] && (
              <span 
                className={`
                  absolute top-8 text-xs font-medium transition-opacity duration-300
                  ${index === currentIndex ? 'opacity-100' : 'opacity-60'}
                `}
              >
                {labels[index]}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;