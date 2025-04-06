import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterText from './TypewriterText';
import ChoiceCards, { Choice } from './ChoiceCards';
import FeedbackModal from './FeedbackModal';
import { playSound } from '../utils/audio';

export interface DilemmaData {
  id: string;
  title: string;
  description: string;
  question: string;
  choices: Choice[];
  statistics?: {
    label: string;
    value: number;
    color: string;
    description?: string;
  }[];
}

interface DilemmaSceneProps {
  dilemma: DilemmaData;
  onComplete: (choiceId: string, feedback?: string) => void;
  isActive: boolean;
  isMuted?: boolean;
}

const DilemmaScene: React.FC<DilemmaSceneProps> = ({
  dilemma,
  onComplete,
  isActive,
  isMuted = false
}) => {
  const [step, setStep] = useState<'intro' | 'question' | 'choices' | 'consequence' | 'feedback'>('intro');
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  // Reset the state when a new dilemma becomes active
  useEffect(() => {
    if (isActive) {
      setStep('intro');
      setSelectedChoice(null);
      setTypingComplete(false);
    }
  }, [isActive, dilemma.id]);

  const handleIntroComplete = () => {
    setTimeout(() => {
      setStep('question');
      playSound('transition', isMuted);
    }, 500);
  };

  const handleQuestionComplete = () => {
    setTimeout(() => {
      setStep('choices');
    }, 300);
    setTypingComplete(true);
  };

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    // Play click sound
    playSound('click', isMuted);
    
    setTimeout(() => {
      setStep('consequence');
    }, 500);
  };

  const handleContinue = () => {
    // Play transition sound
    playSound('transition', isMuted);
    
    if (step === 'consequence') {
      setShowFeedback(true);
    } else if (step === 'feedback' && selectedChoice) {
      onComplete(selectedChoice.id);
    }
  };

  const handleFeedbackSubmit = (feedback: string) => {
    setShowFeedback(false);
    setStep('feedback');
    if (selectedChoice) {
      onComplete(selectedChoice.id, feedback);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    setStep('feedback');
  };

  const sceneVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="dilemma-scene min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 relative"
      variants={sceneVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      exit="exit"
    >
      <div className="max-w-4xl w-full bg-background/90 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-lg">
        <div className="mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: step === 'intro' ? '25%' : step === 'question' ? '50%' : step === 'choices' ? '75%' : '100%' }}
            className="h-1 bg-accent rounded-full mb-4 transition-all duration-700"
          />
          <h2 className="font-classic text-3xl md:text-4xl font-bold">
            <span className="text-highlight">{dilemma.title}</span>
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="my-8"
            >
              <TypewriterText 
                text={dilemma.description}
                element="p"
                className="font-serif text-lg"
                speed={30}
                onComplete={handleIntroComplete}
                skippable={true}
              />
            </motion.div>
          )}

          {step === 'question' && (
            <motion.div
              key="question"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="my-8"
            >
              <TypewriterText 
                text={dilemma.question}
                element="p"
                className="font-classic text-xl"
                speed={40}
                onComplete={handleQuestionComplete}
                skippable={true}
              />
            </motion.div>
          )}

          {step === 'choices' && (
            <motion.div
              key="choices"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="my-8"
            >
              <p className="font-serif mb-6">What will you choose?</p>
              <ChoiceCards 
                choices={dilemma.choices}
                onSelect={handleChoiceSelect}
                selectedId={selectedChoice?.id}
              />
            </motion.div>
          )}

          {step === 'consequence' && selectedChoice && (
            <motion.div
              key="consequence"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="my-8"
            >
              <div className="mb-8">
                <h3 className="font-classic text-xl mb-4">Your Choice:</h3>
                <ChoiceCards 
                  choices={[selectedChoice]}
                  onSelect={() => {}}
                  selectedId={selectedChoice.id}
                  showConsequences={true}
                  disabled={true}
                />
              </div>

              {dilemma.statistics && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="my-8 p-6 bg-tertiary/20 rounded-lg"
                >
                  <h3 className="font-classic text-xl mb-4">How Others Responded:</h3>
                  <div className="flex flex-wrap gap-4">
                    {dilemma.statistics.map((stat) => (
                      <div key={stat.label} className="flex-1 min-w-[120px]">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{stat.label}</span>
                          <span>{stat.value}%</span>
                        </div>
                        <div className="h-2 bg-tertiary/30 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full"
                            style={{ backgroundColor: stat.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ delay: 1.2, duration: 1 }}
                          />
                        </div>
                        {stat.description && (
                          <p className="text-xs mt-1 text-foreground/70">{stat.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <button
                  onClick={handleContinue}
                  className="px-8 py-3 bg-accent text-background rounded-full hover:bg-accent/90 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 'feedback' && (
            <motion.div
              key="ready"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="my-8 text-center"
            >
              <p className="font-serif text-lg mb-6">
                Thank you for your response. Ready to move on to the next dilemma?
              </p>
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-accent text-background rounded-full hover:bg-accent/90 transition-colors"
              >
                Next Dilemma
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feedback modal */}
      <FeedbackModal 
        isOpen={showFeedback}
        onClose={handleFeedbackClose}
        onSubmit={handleFeedbackSubmit}
        dilemmaTitle={dilemma.title}
      />
    </motion.div>
  );
};

export default DilemmaScene;