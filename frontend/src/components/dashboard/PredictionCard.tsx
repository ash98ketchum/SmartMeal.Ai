import React from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Prediction } from '../../types';

interface PredictionCardProps {
  prediction: Prediction;
  index: number;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, index }) => {
  // Calculate accuracy percentage
  const accuracy = 100 - Math.abs((prediction.actualValue - prediction.predictedValue) / prediction.actualValue * 100);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0],
      }
    })
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      className="w-full"
    >
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-32 md:w-32 md:h-auto">
            <img 
              src={prediction.imageUrl} 
              alt={prediction.dishName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge confidence={prediction.confidence} />
            </div>
          </div>
          
          <div className="p-4 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-white mb-1">{prediction.dishName}</h3>
              <div className="flex items-center text-neon-orange">
                <Utensils size={14} className="mr-1" />
                <span className="text-xs font-medium">{prediction.ingredients.length} ingredients</span>
              </div>
            </div>
            
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-xs text-gray-400">Predicted Value</p>
                <p className="font-medium neon-text-cyan">${prediction.predictedValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Actual Value</p>
                <p className="font-medium neon-text-magenta">${prediction.actualValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Accuracy</p>
                <p className="font-medium text-green-400">{accuracy.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Savings</p>
                <p className="font-medium text-neon-violet">${prediction.saved.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PredictionCard;