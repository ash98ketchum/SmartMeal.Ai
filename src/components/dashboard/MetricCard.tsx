import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import GlowingText from '../ui/GlowingText';
import { Metric } from '../../types';
import { iconMap } from '../../data/mockData';

interface MetricCardProps {
  metric: Metric;
  index: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, index }) => {
  const Icon = iconMap[metric.icon as keyof typeof iconMap];

  const isPositive = metric.change >= 0;
  const changeColorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const arrowIcon = isPositive ? '↑' : '↓';

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="w-full"
    >
      <Card 
        className="p-5 h-[140px] flex flex-col justify-between"
        glowColor={index % 2 === 0 ? 'cyan' : 'magenta'}
      >
        <div className="flex justify-between items-start">
          <div className="flex space-x-3 items-center">
            <motion.div
              whileHover={{ rotate: 360, transition: { duration: 1 } }}
              className={`p-2 rounded-lg ${index % 2 === 0 ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-magenta/10 text-neon-magenta'}`}
            >
              <Icon size={18} />
            </motion.div>
            <h3 className="font-medium text-gray-200">{metric.name}</h3>
          </div>
          <span className={`text-xs flex items-center ${changeColorClass}`}>
            {arrowIcon} {Math.abs(metric.change)}{metric.unit || '%'}
          </span>
        </div>
        
        <div className="mt-2">
          <GlowingText 
            text={metric.value}
            variant={index % 2 === 0 ? 'cyan' : 'magenta'}
            className="text-2xl font-bold" 
            hasCountUp
          />
          {metric.unit && <span className="text-gray-400 ml-1">{metric.unit}</span>}
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;
