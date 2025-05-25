import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import Card from '../ui/Card';
import axios from 'axios';

interface ChartSectionProps {
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 border border-green-100 p-3 shadow-md rounded-md">
        <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
        <div className="flex flex-col gap-1 text-gray-600">
          <p className="flex items-center text-xs">
            <span className="inline-block w-3 h-3 bg-green-400 mr-2 rounded-full" />
            Predicted: {payload[0].value}
          </p>
          <p className="flex items-center text-xs">
            <span className="inline-block w-3 h-3 bg-green-600 mr-2 rounded-full" />
            Actual: {payload[1].value}
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
    setActiveIndex(data?.activeTooltipIndex ?? null);
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
      <Card className="p-4 md:p-6" glow>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Prediction Accuracy Over Time
          </h2>
          <div className="space-x-2">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                viewMode === 'weekly'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                viewMode === 'monthly'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} stroke="#D1D5DB" />
              <YAxis tick={{ fill: '#6B7280' }} stroke="#D1D5DB" />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-gray-600">{value}</span>} />

              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke="url(#predictedGradient)"
                strokeWidth={3}
                dot={({ cx, cy, index }: any) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={index === activeIndex ? 5 : 3}
                    fill="#4ADE80"
                    stroke={index === activeIndex ? "#4ADE80" : "transparent"}
                    strokeWidth={index === activeIndex ? 2 : 0}
                    filter={index === activeIndex ? "drop-shadow(0 0 2px #4ADE80)" : "none"}
                  />
                )}
                activeDot={{
                  r: 6,
                  stroke: "#4ADE80",
                  strokeWidth: 2,
                  filter: "drop-shadow(0 0 4px #4ADE80)"
                }}
              />

              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="url(#actualGradient)"
                strokeWidth={3}
                dot={({ cx, cy, index }: any) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={index === activeIndex ? 5 : 3}
                    fill="#16A34A"
                    stroke={index === activeIndex ? "#16A34A" : "transparent"}
                    strokeWidth={index === activeIndex ? 2 : 0}
                    filter={index === activeIndex ? "drop-shadow(0 0 2px #16A34A)" : "none"}
                  />
                )}
                activeDot={{
                  r: 6,
                  stroke: "#16A34A",
                  strokeWidth: 2,
                  filter: "drop-shadow(0 0 4px #16A34A)"
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
