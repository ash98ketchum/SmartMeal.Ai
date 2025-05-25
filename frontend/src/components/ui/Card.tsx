import React, { ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';


// Props definition for the Card component
interface CardProps {
  // Content to be rendered inside the card
  children: ReactNode;
  // Optional custom styling
  className?: string;
  // Whether to apply a glowing ring effect
  glow?: boolean;
  // Whether to enable 3D hover tilt effect
  hoverEffect?: boolean;
}


// Reusable animated card component
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  hoverEffect = true
}) => {

  // Motion values for x and y mouse position relative to card center
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map y-axis movement to rotation around the X-axis
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  // Map x-axis movement to rotation around the Y-axis
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);


  // Spring animation config for smooth tilting motion
  const springConfig = { damping: 20, stiffness: 200 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);


  // Mouse movement handler to calculate distance from center of card
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hoverEffect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }


  // Reset tilt when mouse leaves card
  function handleMouseLeave() {
    if (!hoverEffect) return;
    x.set(0);
    y.set(0);
  }


  // Optional scaling animation for subtle zoom on hover
  const variants = {
    initial: { scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className={`
        bg-white shadow-md rounded-xl
        ${glow ? 'ring-2 ring-green-200 ring-opacity-50' : ''}
        ${className}
      `}
      style={{
        x: 0,
        y: 0,
        rotateX: hoverEffect ? springRotateX : 0,
        rotateY: hoverEffect ? springRotateY : 0,
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial="initial"
      whileHover={hoverEffect ? "hover" : undefined}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default Card;
