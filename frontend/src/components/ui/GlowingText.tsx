import React from 'react';
import { motion } from 'framer-motion';

interface GlowingTextProps {
  text: string | number;                  // The text or number to display
  variant?: 'green' | 'white';            // Style variant - glowing green or solid white
  className?: string;                     // Additional custom styling
  hasCountUp?: boolean;                   // Whether to animate numeric count-up
}

// Main GlowingText component
const GlowingText: React.FC<GlowingTextProps> = ({
  text,
  variant = 'green',
  className = '',
  hasCountUp = false
}) => {
  // Apply gradient or white color styles based on variant
  const colorClass =
    variant === 'white'
      ? 'text-white' // Plain white
      : 'bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600'; // Glowing green text gradient

  // Framer-motion animation config for fade-in effect during count-up
  const countUpVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1 }
    }
  };

  // If count-up animation is enabled and input is a number, animate it
  return hasCountUp ? (
    <motion.span
      className={`${colorClass} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }} // Triggers animation only once when it enters view
      variants={countUpVariants}
    >
      {typeof text === 'number' ? (
        <Counter from={0} to={text} duration={2} /> // Animate number from 0 to final value
      ) : (
        text
      )}
    </motion.span>
  ) : (
    // Regular span if no animation is required
    <span className={`${colorClass} ${className}`}>
      {text}
    </span>
  );
};

// Counter component: handles rendering animated number
const Counter = ({ from, to, duration }: { from: number; to: number; duration: number }) => {
  const count = useCountUp(from, to, duration); // Get animated value using custom hook
  return <>{count}</>; // Display animated value
};

// Custom hook to animate number from `from` to `to` over a `duration`
function useCountUp(from: number, to: number, duration: number = 2) {
  const [count, setCount] = React.useState(from); // Track current displayed number

  React.useEffect(() => {
    let startTimestamp: number | null = null;

    // Function to update number frame-by-frame
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1); // Normalize 0 to 1
      setCount(Math.floor(progress * (to - from) + from)); // Calculate next value

      if (progress < 1) {
        window.requestAnimationFrame(step); // Continue animation if not done
      }
    };

    window.requestAnimationFrame(step); // Start animation

    return () => setCount(from); // Reset when unmounted
  }, [from, to, duration]);

  // Format value depending on whether it's an integer or float
  if (Number.isInteger(to)) {
    return count; // Show as integer
  } else {
    const decimals = to.toString().split('.')[1]?.length || 0; // Determine decimal precision
    return count.toFixed(decimals); // Show as fixed decimal
  }
}

export default GlowingText;
