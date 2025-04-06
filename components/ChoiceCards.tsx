import React from 'react';
import { motion } from 'framer-motion';

export interface Choice {
  id: string;
  text: string;
  description?: string;
  consequences?: string;
}

interface ChoiceCardsProps {
  choices: Choice[];
  onSelect: (choice: Choice) => void;
  selectedId?: string;
  showConsequences?: boolean;
  disabled?: boolean;
}

const ChoiceCards: React.FC<ChoiceCardsProps> = ({
  choices,
  onSelect,
  selectedId,
  showConsequences = false,
  disabled = false
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    selected: {
      scale: 1.03,
      borderColor: "var(--color-accent)",
      backgroundColor: "var(--color-accent-light)",
      transition: {
        duration: 0.3
      }
    },
    unselected: {
      scale: 0.98,
      opacity: 0.7,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="choice-cards grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {choices.map((choice, index) => (
        <motion.div
          key={choice.id}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate={
            selectedId 
              ? selectedId === choice.id 
                ? "selected" 
                : "unselected" 
              : "visible"
          }
          whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          onClick={() => !disabled && onSelect(choice)}
          className={`
            choice-card relative p-6 rounded-lg border-2 cursor-pointer
            ${selectedId === choice.id ? 'border-accent bg-accent/10' : 'border-secondary/30 bg-tertiary/20'}
            ${disabled ? 'cursor-default' : 'hover:shadow-lg'}
            transition-all duration-300
          `}
        >
          <h3 className="font-classic text-xl mb-2">{choice.text}</h3>
          
          {choice.description && (
            <p className="font-serif text-sm text-foreground/80 mb-4">{choice.description}</p>
          )}
          
          {showConsequences && selectedId === choice.id && choice.consequences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 pt-4 border-t border-secondary/30"
            >
              <p className="font-serif italic text-foreground/90">{choice.consequences}</p>
            </motion.div>
          )}

          {selectedId === choice.id && (
            <motion.div
              className="absolute -top-2 -right-2 bg-accent text-background rounded-full w-6 h-6 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ChoiceCards;