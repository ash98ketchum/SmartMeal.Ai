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


// A card component that displays details of a prediction result
const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, index }) => {

  // Calculate prediction accuracy as a percentage
  const accuracy =
    100 -
    Math.abs(
      ((prediction.actualValue - prediction.predictedValue) / prediction.actualValue) *
        100
    );


    // Framer Motion variants for entrance animation
  const variants = {
    // Start position (hidden)
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 // Staggered animation based on index
        , duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
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
      <Card className="overflow-hidden bg-white" glow={false}>
        <div className="flex flex-col md:flex-row">
          {/* Image & Badge */}
          <div className="relative h-32 md:w-32 md:h-auto">
            <img
              src={prediction.imageUrl}
              alt={prediction.dishName}
              className="w-full h-full object-cover rounded-l-lg"
            />
            <div className="absolute top-2 left-2">
              {/* Badge stays green-themed */}
              <Badge confidence={prediction.confidence} showLabel={false} />
            </div>
          </div>

          {/* Details */}
          <div className="p-4 flex-1 bg-white">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {prediction.dishName}
              </h3>
              <div className="flex items-center text-green-600">
                <Utensils size={14} className="mr-1" />
                <span className="text-xs font-medium text-gray-700">
                  {prediction.ingredients.length} ingredients
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
              <div>
                <p className="text-xs">Predicted Value</p>
                <p className="font-medium text-green-600">
                  ${prediction.predictedValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs">Actual Value</p>
                <p className="font-medium text-gray-800">
                  ${prediction.actualValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs">Accuracy</p>
                <p className="font-medium text-green-500">
                  {accuracy.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs">Savings</p>
                <p className="font-medium text-green-600">
                  ${prediction.saved.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};


// Export the component for use elsewhere
export default PredictionCard;
