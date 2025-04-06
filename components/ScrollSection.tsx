import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'fade';

interface ScrollSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  animateDirection?: AnimationDirection;
  delay?: number;
  duration?: number;
  threshold?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  pinned?: boolean;
  onViewportEnter?: () => void;
  preload?: boolean;
}

const sectionVariants: Record<AnimationDirection, Variants> = {
  up: {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  down: {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  left: {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  right: {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
};

export const ScrollSection: React.FC<ScrollSectionProps> = ({ 
  children, 
  id, 
  className = '', 
  animateDirection = 'up', 
  delay = 0, 
  duration = 0.8,
  threshold = 0.3,
  staggerChildren = false,
  staggerDelay = 0.15,
  pinned = false,
  onViewportEnter,
  preload = true
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: false, 
    amount: threshold,
    margin: preload ? "500px 0px 0px 0px" : "0px"  // Preload content before it enters viewport
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      if (onViewportEnter) onViewportEnter();
    }
  }, [isInView, controls, onViewportEnter]);

  useEffect(() => {
    if (pinned && ref.current) {
      const pinSetting = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false
      });
      
      return () => {
        pinSetting.kill();
      };
    }
  }, [pinned]);

  // Initialize content on mount for IVF and cloning sections
  useEffect(() => {
    if (id === 'ivf' || id === 'cloning') {
      // Add a small delay so main content loads first
      const timer = setTimeout(() => {
        controls.start('visible');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [id, controls]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`${className} relative overflow-hidden`}
      initial="hidden"
      animate={controls}
      variants={sectionVariants[animateDirection]}
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: "easeOut",
        staggerChildren: staggerChildren ? staggerDelay : 0
      }}
    >
      {children}
    </motion.section>
  );
};

export default ScrollSection;