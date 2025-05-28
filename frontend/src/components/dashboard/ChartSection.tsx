// src/components/dashboard/ChartSection.tsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import Card from '../ui/Card';
import axios from 'axios';

interface SeriesPoint {
  date: string;
  actual: number;
  predicted: number;
  actualEarning: number;
  predictedEarning: number;
}

const ChartSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [data, setData] = useState<SeriesPoint[]>([]);
  const [viewMode, setViewMode] = useState<'weekly'|'monthly'>('weekly');

  useEffect(() => {
    (async () => {
      try {
        // 1) historical actual + earning (archived)
        const actualRes = await axios.get<SeriesPoint[]>(`/api/dataformodel/${viewMode}`);
        // 2) historical predicted + earning
        const predRes   = await axios.get<SeriesPoint[]>(`/api/predicted/${viewMode}`);
        // 3) today’s live servings
        const todayRes  = await axios.get<{ totalPlates: number; totalEarning: number }[]>(
          '/api/servings'
        );

        // merge historical
        const actualMap = Object.fromEntries(
          actualRes.data.map(d => [d.date, { actual: d.actual, actualEarning: d.actualEarning }])
        );
        const predMap   = Object.fromEntries(
          predRes.data.map(d => [d.date, { predicted: d.predicted, predictedEarning: d.predictedEarning }])
        );
        const allDates = Array.from(new Set([
          ...actualRes.data.map(d => d.date),
          ...predRes.data.map(d => d.date)
        ])).sort();

        const merged: SeriesPoint[] = allDates.map(date => ({
          date,
          actual: actualMap[date]?.actual  || 0,
          actualEarning: actualMap[date]?.actualEarning || 0,
          predicted: predMap[date]?.predicted || 0,
          predictedEarning: predMap[date]?.predictedEarning || 0
        }));

        // compute today’s sums
        const todaySumServings = todayRes.data.reduce((sum, s) => sum + (s.totalPlates || 0), 0);
        const todaySumEarning  = parseFloat(
          todayRes.data.reduce((sum, s) => sum + (s.totalEarning || 0), 0)
          .toFixed(2)
        );
        const todayStamp = new Date().toISOString().split('T')[0];

        // replace or append today’s point
        const lastIdx = merged.findIndex(pt => pt.date === todayStamp);
        const todayPoint: SeriesPoint = {
          date: todayStamp,
          actual: todaySumServings,
          actualEarning: todaySumEarning,
          predicted: predMap[todayStamp]?.predicted  || 0,
          predictedEarning: predMap[todayStamp]?.predictedEarning || 0
        };
        if (lastIdx > -1) {
          merged[lastIdx] = todayPoint;
        } else {
          merged.push(todayPoint);
        }

        setData(merged);
      } catch (err) {
        console.error('ChartSection fetch error:', err);
      }
    })();
  }, [viewMode]);

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const getVal = (key: string) => payload.find((p: any) => p.dataKey === key)?.value ?? 0;
    return (
      <div className="bg-white/90 border border-green-100 p-3 shadow-md rounded-md">
        <p className="font-medium text-gray-700 mb-2">{label}</p>
        {[
          ['predicted','Predicted Servings','bg-green-400'],
          ['actual','Actual Servings','bg-green-600'],
          ['predictedEarning','Predicted Earning','bg-blue-300'],
          ['actualEarning','Actual Earning','bg-blue-500']
        ].map(([k, lbl, c]) => (
          <p key={k} className="text-xs text-gray-600 flex items-center">
            <span className={`w-3 h-3 ${c} mr-2 rounded-full`} />
            {lbl}: {getVal(k)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={className}
    >
      <Card className="p-6" glow>
        <div className="flex justify-between mb-4 items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Servings & Earnings: Actual vs Predicted
          </h2>
          <div className="space-x-2">
            {(['weekly','monthly'] as const).map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  viewMode===m
                    ? 'bg-green-100 text-green-600'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50'
                }`}
              >
                {m[0].toUpperCase()+m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill:'#6B7280' }} stroke="#D1D5DB" />
              <YAxis tick={{ fill:'#6B7280' }} stroke="#D1D5DB" />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span className="text-gray-600">{v}</span>} />

              <Line dataKey="predicted"        name="Predicted Servings"   stroke="#4ADE80" />
              <Line dataKey="actual"           name="Actual Servings"      stroke="#16A34A" />
              <Line dataKey="predictedEarning" name="Predicted Earning"    stroke="#93C5FD" strokeDasharray="5 5" />
              <Line dataKey="actualEarning"    name="Actual Earning"       stroke="#3B82F6" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default ChartSection;
