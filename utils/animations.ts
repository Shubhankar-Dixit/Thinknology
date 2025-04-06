import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Animation variants for Framer Motion
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    } 
  }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    } 
  }
};

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    } 
  }
};

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    } 
  }
};

// GSAP animations
export const useTypingAnimation = (
  selector: string,
  text: string,
  speed: number = 50,
  delay: number = 0
) => {
  const isPlayedRef = useRef(false);
  
  useEffect(() => {
    const element = document.querySelector(selector);
    if (!element || isPlayedRef.current) return;
    
    let currentText = '';
    
    const timeline = gsap.timeline({
      delay: delay / 1000,
      onComplete: () => {
        isPlayedRef.current = true;
      }
    });
    
    timeline.set(element, { text: '' });
    
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      timeline.to(
        element, 
        { 
          text: currentText, 
          duration: speed / 1000,
          ease: "none"
        }
      );
    }
    
    return () => {
      timeline.kill();
    };
  }, [selector, text, speed, delay]);
};

export const useScrollAnimation = (
  selector: string,
  animationType: 'fadeIn' | 'fadeUp' | 'slideLeft' | 'slideRight' | 'scale',
  options: {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
    start?: string;
    end?: string;
  } = {}
) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    const animations: Record<string, any> = {
      fadeIn: { opacity: 0, duration: 0.8, opacity: 1 },
      fadeUp: { opacity: 0, y: 30, duration: 0.6, opacity: 1, y: 0 },
      slideLeft: { opacity: 0, x: -50, duration: 0.6, opacity: 1, x: 0 },
      slideRight: { opacity: 0, x: 50, duration: 0.6, opacity: 1, x: 0 },
      scale: { opacity: 0, scale: 0.8, duration: 0.8, opacity: 1, scale: 1 }
    };
    
    const { start = 'top 80%', end = 'bottom 20%' } = options;
    
    elements.forEach(element => {
      gsap.fromTo(
        element,
        { 
          opacity: 0, 
          ...(animationType === 'fadeUp' && { y: 30 }),
          ...(animationType === 'slideLeft' && { x: -50 }),
          ...(animationType === 'slideRight' && { x: 50 }),
          ...(animationType === 'scale' && { scale: 0.8 })
        },
        {
          opacity: 1,
          ...(animationType === 'fadeUp' && { y: 0 }),
          ...(animationType === 'slideLeft' && { x: 0 }),
          ...(animationType === 'slideRight' && { x: 0 }),
          ...(animationType === 'scale' && { scale: 1 }),
          duration: animationType === 'fadeIn' ? 0.8 : 0.6,
          scrollTrigger: {
            trigger: element,
            start,
            end,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, [selector, animationType, options]);
};

export default {
  fadeInVariants,
  fadeUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
  scaleUpVariants,
  slideInLeftVariants,
  slideInRightVariants,
  useTypingAnimation,
  useScrollAnimation
};