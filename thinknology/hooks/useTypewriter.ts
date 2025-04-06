import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export const useTypewriter = ({
  text,
  speed = 50,
  delay = 0,
  onComplete
}: UseTypewriterOptions) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Reset the effect if text changes
  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
  }, [text]);

  // Typing effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!text) return;
    
    // Initial delay before starting
    const startTyping = () => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typeNextCharacter = () => {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text.charAt(currentIndex));
          currentIndex++;
          timer = setTimeout(typeNextCharacter, speed);
        } else {
          setIsTyping(false);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      };
      
      typeNextCharacter();
    };
    
    const delayTimer = setTimeout(startTyping, delay);
    
    // Cleanup function
    return () => {
      clearTimeout(delayTimer);
      clearTimeout(timer);
    };
  }, [text, speed, delay, onComplete]);
  
  const skipTyping = useCallback(() => {
    setDisplayText(text);
    setIsTyping(false);
    setIsComplete(true);
    if (onComplete) onComplete();
  }, [text, onComplete]);

  return {
    displayText,
    isTyping,
    isComplete,
    skipTyping
  };
};

export default useTypewriter;