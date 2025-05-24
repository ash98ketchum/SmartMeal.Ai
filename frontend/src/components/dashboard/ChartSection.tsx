import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../ui/Card';
import axios from 'axios';

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
  const [chartData, setChartData] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actualRes, predictedRes] = await Promise.all([
          axios.get(`/api/dataformodel/${viewMode}`),
          axios.get(`/api/predicted/${viewMode}`)
        ]);

        const actualData = actualRes.data;
        const predictedData = predictedRes.data;

        const merged = actualData.map((entry: any, index: number) => ({
          name: entry.name || entry.date || `Day ${index + 1}`,
          actual: entry.servings,
          predicted: predictedData[index]?.predictedServings || 0,
        }));

        setChartData(merged);
      } catch (error) {
        console.error('Failed to fetch chart data', error);
      }
    };

    fetchData();
  }, [viewMode]);

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-semibold">Prediction Accuracy Over Time</h2>
          <div className="space-x-2">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 rounded-md text-sm ${
                viewMode === 'weekly'
                  ? 'bg-neon-cyan text-black'
                  : 'bg-midnight-700 text-white border border-white/10'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 rounded-md text-sm ${
                viewMode === 'monthly'
                  ? 'bg-neon-cyan text-black'
                  : 'bg-midnight-700 text-white border border-white/10'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <defs>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#08F7FE" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#08F7FE" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FE53BB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FE53BB" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#e0e6f1' }} stroke="rgba(255, 255, 255, 0.2)" />
              <YAxis tick={{ fill: '#e0e6f1' }} stroke="rgba(255, 255, 255, 0.2)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke="#08F7FE"
                strokeWidth={3}
                dot={({ cx, cy, index }: any) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={index === activeIndex ? 5 : 3}
                    fill="#08F7FE"
                    stroke={index === activeIndex ? "#08F7FE" : "transparent"}
                    strokeWidth={index === activeIndex ? 2 : 0}
                    filter={index === activeIndex ? "drop-shadow(0 0 2px #08F7FE)" : "none"}
                  />
                )}
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
                dot={({ cx, cy, index }: any) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={index === activeIndex ? 5 : 3}
                    fill="#FE53BB"
                    stroke={index === activeIndex ? "#FE53BB" : "transparent"}
                    strokeWidth={index === activeIndex ? 2 : 0}
                    filter={index === activeIndex ? "drop-shadow(0 0 2px #FE53BB)" : "none"}
                  />
                )}
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
