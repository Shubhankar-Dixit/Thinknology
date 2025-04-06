import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface QuizOption {
  id: string;
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  scenario: string;
  context: string;
  options: QuizOption[];
  data?: {
    label: string;
    value: number;
    color?: string;
  }[];
}

interface QuizProps {
  question: QuizQuestion;
  onComplete?: (selectedOption: string) => void;
  className?: string;
}

const Quiz: React.FC<QuizProps> = ({ 
  question, 
  onComplete,
  className = '' 
}) => {
  const [step, setStep] = useState<'scenario' | 'context' | 'question' | 'result'>('scenario');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setIsRevealed(true);
    if (onComplete) {
      onComplete(optionId);
    }
  };

  const handleNextStep = () => {
    if (step === 'scenario') {
      setStep('context');
    } else if (step === 'context') {
      setStep('question');
    } else if (step === 'question' && selectedOption) {
      setStep('result');
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 }
  };

  return (
    <div className={`quiz-container ${className} bg-tertiary/20 rounded-xl overflow-hidden shadow-lg`}>
      <AnimatePresence mode="wait">
        {step === 'scenario' && (
          <motion.div
            key="scenario"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <h3 className="font-classic text-2xl mb-6 text-center">The Ethical Scenario</h3>
            <p className="font-serif text-lg mb-8">{question.scenario}</p>
            <div className="text-center">
              <button 
                onClick={handleNextStep}
                className="px-6 py-3 bg-accent text-background rounded-full hover:bg-accent/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 'context' && (
          <motion.div
            key="context"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <h3 className="font-classic text-2xl mb-6 text-center">Context & Considerations</h3>
            <div className="prose max-w-none mb-8 font-modern">
              <div dangerouslySetInnerHTML={{ __html: question.context }} />
            </div>
            
            {question.data && (
              <div className="data-visualization my-8 p-4 bg-background/50 rounded-lg">
                <h4 className="text-center font-classic mb-4">Key Data</h4>
                <div className="flex justify-around items-end h-40 mb-4">
                  {question.data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <motion.div 
                        className="data-bar w-16 rounded-t-lg"
                        style={{ backgroundColor: item.color || 'var(--accent)' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${item.value}%` }}
                        transition={{ delay: index * 0.2, duration: 1, ease: "easeOut" }}
                      />
                      <span className="mt-2 text-sm font-mono">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-center">
              <button 
                onClick={handleNextStep}
                className="px-6 py-3 bg-accent text-background rounded-full hover:bg-accent/90 transition-colors"
              >
                What Would You Choose?
              </button>
            </div>
          </motion.div>
        )}

        {step === 'question' && (
          <motion.div
            key="question"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <h3 className="font-classic text-2xl mb-8 text-center">What Would You Do?</h3>
            
            <div className="space-y-4">
              {question.options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full text-left p-4 rounded-lg border border-secondary transition-all ${
                    selectedOption === option.id ? 'bg-tertiary border-highlight' : 'hover:bg-tertiary/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="font-classic text-lg">{option.text}</p>
                </motion.button>
              ))}
            </div>
            
            {selectedOption && (
              <div className="mt-8 text-center">
                <button 
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-accent text-background rounded-full hover:bg-accent/90 transition-colors"
                >
                  See Analysis
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'result' && selectedOption && (
          <motion.div
            key="result"
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <h3 className="font-classic text-2xl mb-6 text-center">Ethical Analysis</h3>
            
            <div className="bg-background/50 p-6 rounded-lg mb-6">
              <p className="font-classic text-lg mb-2">Your choice:</p>
              <p className="font-serif">{question.options.find(opt => opt.id === selectedOption)?.text}</p>
            </div>
            
            <div className="prose max-w-none mb-8">
              <h4 className="font-classic text-xl mb-4">Explanation:</h4>
              <p className="font-serif">{question.options.find(opt => opt.id === selectedOption)?.explanation}</p>
            </div>
            
            <p className="text-center font-classic italic text-lg">
              Ethical questions rarely have simple answers. The dialogue continues...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;