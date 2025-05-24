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
  const colorClass = getConfidenceColor(confidence);
  
  let bgColorClass = '';
  if (level === 'low') bgColorClass = 'bg-neon-orange/10';
  else if (level === 'medium') bgColorClass = 'bg-neon-cyan/10';
  else bgColorClass = 'bg-neon-magenta/10';
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 500,
        damping: 30
      }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColorClass} ${colorClass} ${className}`}
    >
      <motion.span
        animate={{ 
          boxShadow: ['0 0 0px currentColor', '0 0 3px currentColor', '0 0 0px currentColor'],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
        }}
        className="w-2 h-2 rounded-full mr-1.5"
      ></motion.span>
      {confidence}%
      {showLabel && (
        <span className="ml-1 opacity-90">
          {level === 'high' ? 'High' : level === 'medium' ? 'Medium' : 'Low'}
        </span>
      )}
    </motion.div>
  );
};

export default Badge;