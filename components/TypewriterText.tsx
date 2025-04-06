import React, { useCallback } from 'react';
import useTypewriter from '@hooks/useTypewriter';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  className?: string;
  element?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  skippable?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className = '',
  element = 'p',
  speed = 40,
  delay = 0,
  onComplete,
  skippable = true
}) => {
  const { displayText, isTyping, skipTyping } = useTypewriter({
    text,
    speed,
    delay,
    onComplete
  });

  const handleClick = useCallback(() => {
    if (skippable && isTyping) {
      skipTyping();
    }
  }, [isTyping, skipTyping, skippable]);

  const Element = element;

  return (
    <motion.div 
      className={`typewriter-container ${isTyping ? 'typing' : 'complete'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Element 
        className={`typewriter-text ${className}`} 
        onClick={handleClick}
      >
        {displayText}
        {isTyping && (
          <span className="typewriter-cursor">|</span>
        )}
      </Element>
    </motion.div>
  );
};

export default TypewriterText;