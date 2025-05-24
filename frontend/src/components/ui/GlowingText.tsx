import React from 'react';
import { motion } from 'framer-motion';

interface GlowingTextProps {
  text: string | number;
  variant?: 'cyan' | 'magenta' | 'violet' | 'orange';
  className?: string;
  hasCountUp?: boolean;
}

const GlowingText: React.FC<GlowingTextProps> = ({ 
  text, 
  variant = 'cyan',
  className = '',
  hasCountUp = false
}) => {
  let gradientClass = '';
  
  switch (variant) {
    case 'cyan':
      gradientClass = 'neon-gradient-cyan';
      break;
    case 'magenta':
      gradientClass = 'neon-gradient-magenta';
      break;
    case 'violet':
      gradientClass = 'from-neon-violet to-neon-cyan text-transparent bg-clip-text bg-gradient-to-r';
      break;
    case 'orange':
      gradientClass = 'from-neon-orange to-neon-magenta text-transparent bg-clip-text bg-gradient-to-r';
      break;
  }

  // Count up animation
  const countUpVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1
      }
    }
  };

  return hasCountUp ? (
    <motion.span
      className={`${gradientClass} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={countUpVariants}
      animate={{ number: typeof text === 'number' ? text : 0 }}
    >
      {typeof text === 'number' ? (
        <Counter from={0} to={text} duration={2} />
      ) : (
        text
      )}
    </motion.span>
  ) : (
    <span className={`${gradientClass} ${className}`}>{text}</span>
  );
};

// Counter component for numeric values
const Counter = ({ from, to, duration }: { from: number; to: number; duration: number }) => {
  const count = useCountUp(from, to, duration);
  return <>{count}</>;
};

// Custom hook for count-up animation
function useCountUp(from: number, to: number, duration: number = 2) {
  const [count, setCount] = React.useState(from);
  
  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
    
    return () => setCount(from);
  }, [from, to, duration]);
  
  // Handle decimal numbers
  if (Number.isInteger(to)) {
    return count;
  } else {
    const fixed = to.toString().split('.')[1]?.length || 0;
    return count.toFixed(fixed);
  }
}

export default GlowingText;