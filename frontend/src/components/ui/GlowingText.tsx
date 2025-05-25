import React from 'react';
import { motion } from 'framer-motion';

interface GlowingTextProps {
  text: string | number;
  variant?: 'green' | 'white';
  className?: string;
  hasCountUp?: boolean;
}

const GlowingText: React.FC<GlowingTextProps> = ({
  text,
  variant = 'green',
  className = '',
  hasCountUp = false
}) => {
  // Tailwind classes for our SmartMealAI green-and-white theme
  const colorClass =
    variant === 'white'
      ? 'text-white'
      : 'bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600';

  // Count-up animation variants
  const countUpVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1 }
    }
  };

  return hasCountUp ? (
    <motion.span
      className={`${colorClass} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={countUpVariants}
    >
      {typeof text === 'number' ? (
        <Counter from={0} to={text} duration={2} />
      ) : (
        text
      )}
    </motion.span>
  ) : (
    <span className={`${colorClass} ${className}`}>
      {text}
    </span>
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

  if (Number.isInteger(to)) {
    return count;
  } else {
    const decimals = to.toString().split('.')[1]?.length || 0;
    return count.toFixed(decimals);
  }
}

export default GlowingText;
