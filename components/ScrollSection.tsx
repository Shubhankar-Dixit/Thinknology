import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface ScrollSectionProps {
  id?: string;
  className?: string;
  animateDirection?: 'up' | 'down' | 'left' | 'right' | 'fade';
  threshold?: number;
  delay?: number;
  onViewportEnter?: () => void;
  children: ReactNode;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({
  id,
  className = '',
  animateDirection = 'up',
  threshold = 0.1,
  delay = 0,
  onViewportEnter,
  children
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: animateDirection === 'up' ? 50 : animateDirection === 'down' ? -50 : 0,
      x: animateDirection === 'left' ? 50 : animateDirection === 'right' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: delay
      }
    }
  };

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, threshold }}
      variants={variants}
      onViewportEnter={onViewportEnter}
    >
      {children}
    </motion.section>
  );
};

export default ScrollSection;