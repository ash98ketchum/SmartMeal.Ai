import React from 'react';
import { motion } from 'framer-motion';
import { getConfidenceLevel, getConfidenceColor } from '../../data/mockData';

interface BadgeProps {
  confidence: number;
  showLabel?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ confidence, showLabel = true, className = '' }) => {
  const level = getConfidenceLevel(confidence);
  
  // Green-themed classes
  let bgColorClass = '';
  let textColorClass = 'text-green-700';

  if (level === 'low') bgColorClass = 'bg-green-100';
  else if (level === 'medium') bgColorClass = 'bg-green-200';
  else bgColorClass = 'bg-green-300';
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColorClass} ${textColorClass} ${className}`}
    >
      <motion.span
        animate={{
          boxShadow: ['0 0 0px currentColor', '0 0 4px currentColor', '0 0 0px currentColor'],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="w-2 h-2 rounded-full mr-1.5"
      />
      {confidence}%
      {showLabel && (
        <span className="ml-1 opacity-90 capitalize">
          {level}
        </span>
      )}
    </motion.div>
  );
};

export default Badge;
