import React, { ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'none';
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'none',
  hoverEffect = true
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  let glowClass = '';
  if (glowColor === 'cyan') glowClass = 'neon-border-cyan';
  else if (glowColor === 'magenta') glowClass = 'neon-border-magenta';

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hoverEffect) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  }
  
  function handleMouseLeave() {
    if (!hoverEffect) return;
    
    x.set(0);
    y.set(0);
  }
  
  const variants = {
    hover: { 
      scale: 1.02,
      transition: { duration: 0.3 }
    },
    initial: { 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      className={`glass-panel ${glowClass} ${className}`}
      style={{ 
        x: 0, 
        y: 0,
        rotateX: hoverEffect ? springRotateX : 0,
        rotateY: hoverEffect ? springRotateY : 0,
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={hoverEffect ? "hover" : undefined}
      variants={variants}
      initial="initial"
    >
      {children}
    </motion.div>
  );
};

export default Card;