import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl',
        'dark:bg-black/20 dark:border-white/10',
        className
      )}
    >
      {children}
    </motion.div>
  );
};