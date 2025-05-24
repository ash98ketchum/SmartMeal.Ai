import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../ui/Card';
import { chartData } from '../../data/mockData';

interface ChartSectionProps {
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border-white/5 !shadow-none">
        <p className="text-sm font-medium mb-1">{label}</p>
        <div className="flex flex-col gap-1">
          <p className="text-xs flex items-center">
            <span className="inline-block w-3 h-3 bg-neon-cyan mr-2 rounded-full"></span>
            Predicted: ${payload[0].value}
          </p>
          <p className="text-xs flex items-center">
            <span className="inline-block w-3 h-3 bg-neon-magenta mr-2 rounded-full"></span>
            Actual: ${payload[1].value}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const ChartSection: React.FC<ChartSectionProps> = ({ className = '' }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const handleMouseMove = (data: any) => {
    if (data && data.activeTooltipIndex !== undefined) {
      setActiveIndex(data.activeTooltipIndex);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={className}
    >
      <Card className="p-4 md:p-6" glowColor="cyan">
        <h2 className="text-lg md:text-xl font-semibold mb-6">Prediction Accuracy Over Time</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#08F7FE" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#08F7FE" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FE53BB" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FE53BB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#e0e6f1' }} 
                stroke="rgba(255, 255, 255, 0.2)"
              />
              <YAxis 
                tick={{ fill: '#e0e6f1' }} 
                stroke="rgba(255, 255, 255, 0.2)"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                name="Predicted" 
                stroke="#08F7FE"
                strokeWidth={3}
                dot={(props: any) => {
                  const { cx, cy, index } = props;
                  const isActive = index === activeIndex;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isActive ? 5 : 3}
                      fill="#08F7FE"
                      stroke={isActive ? "#08F7FE" : "transparent"}
                      strokeWidth={isActive ? 2 : 0}
                      filter={isActive ? "drop-shadow(0 0 2px #08F7FE)" : "none"}
                    />
                  );
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: "#08F7FE",
                  strokeWidth: 2,
                  filter: "drop-shadow(0 0 4px #08F7FE)"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                name="Actual" 
                stroke="#FE53BB" 
                strokeWidth={3}
                dot={(props: any) => {
                  const { cx, cy, index } = props;
                  const isActive = index === activeIndex;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isActive ? 5 : 3}
                      fill="#FE53BB"
                      stroke={isActive ? "#FE53BB" : "transparent"}
                      strokeWidth={isActive ? 2 : 0}
                      filter={isActive ? "drop-shadow(0 0 2px #FE53BB)" : "none"}
                    />
                  );
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: "#FE53BB",
                  strokeWidth: 2,
                  filter: "drop-shadow(0 0 4px #FE53BB)"
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChartSection;