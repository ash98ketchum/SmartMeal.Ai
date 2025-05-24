import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import GlowingText from '../ui/GlowingText';
import { Metric } from '../../types';
import { iconMap } from '../../data/mockData';

// JSON import
import predictedData from '../../../predicted.json';

interface PredictedSummary {
  trainedAt: string;
  epsilon: number;
  dishes: string[];
  q_values: number[];
  counts: number[];
  bestAction: { dish: string; value: number };
}

const createMetrics = (summary: PredictedSummary): Metric[] => {
  const { epsilon, dishes, q_values, bestAction } = summary;
  const totalDishes = dishes.length;
  const avgReward = parseFloat(
    (q_values.reduce((sum, v) => sum + v, 0) / q_values.length).toFixed(2)
  );

  return [
    {
      id: 'epsilon',
      name: 'Epsilon',
      icon: 'Carrot',      // matches iconMap key
      value: epsilon,
      change: 0,
      unit: ''
    },
    {
      id: 'totalDishes',
      name: 'Total Dishes',
      icon: 'DollarSign',
      value: totalDishes,
      change: 0,
      unit: ''
    },
    {
      id: 'bestValue',
      name: `Best Dish: ${bestAction.dish}`,
      icon: 'TrendingUp',
      value: parseFloat(bestAction.value.toFixed(2)),
      change: 0,
      unit: ''
    },
    {
      id: 'avgReward',
      name: 'Avg Reward',
      icon: 'BarChart',
      value: avgReward,
      change: 0,
      unit: ''
    }
  ];
};

const MetricCard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    const summary = (predictedData as unknown) as PredictedSummary;
    setMetrics(createMetrics(summary));
  }, []);

  if (metrics.length === 0) return <div>Loading metrics...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = iconMap[metric.icon as keyof typeof iconMap];
        const isPositive = metric.change >= 0;
        const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
        const arrow = isPositive ? '↑' : '↓';

        return (
          <motion.div
            key={metric.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: 'easeOut' }}
            className="w-full"
          >
            <Card
              className="p-5 h-[140px] flex flex-col justify-between"
              glowColor={idx % 2 === 0 ? 'cyan' : 'magenta'}
            >
              <div className="flex justify-between items-start">
                <div className="flex space-x-3 items-center">
                  <motion.div
                    whileHover={{ rotate: 360, transition: { duration: 1 } }}
                    className={`p-2 rounded-lg ${
                      idx % 2 === 0
                        ? 'bg-neon-cyan/10 text-neon-cyan'
                        : 'bg-neon-magenta/10 text-neon-magenta'
                    }`}
                  >
                    <Icon size={18} />
                  </motion.div>
                  <h3 className="font-medium text-gray-200">{metric.name}</h3>
                </div>
                <span className={`text-xs flex items-center ${changeColor}`}>
                  {arrow} {Math.abs(metric.change)}{metric.unit}
                </span>
              </div>

              <div className="mt-2">
                <GlowingText
                  text={metric.value}
                  variant={idx % 2 === 0 ? 'cyan' : 'magenta'}
                  className="text-2xl font-bold"
                  hasCountUp={true}
                />
                {metric.unit && <span className="text-gray-400 ml-1">{metric.unit}</span>}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricCard;
