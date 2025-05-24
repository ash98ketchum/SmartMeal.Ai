import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import MetricCard from '../components/dashboard/MetricCard';
import PredictionCard from '../components/dashboard/PredictionCard';
import ChartSection from '../components/dashboard/ChartSection';
import EventsList from '../components/dashboard/EventsList';
import FilterBar from '../components/dashboard/FilterBar';
import { mockPredictions, getMetrics } from '../data/mockData';
import { FilterOptions } from '../types';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'week',
    confidenceLevel: ['medium', 'high'],
    ingredientCount: [3, 7],
    savedAmount: [5, 20]
  });
  
  const metrics = getMetrics();
  
  const filteredPredictions = mockPredictions.filter(prediction => {
    // Filter by date range
    const predictionDate = new Date(prediction.date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - predictionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (filters.dateRange) {
      case 'today':
        if (diffDays > 0) return false;
        break;
      case 'week':
        if (diffDays > 7) return false;
        break;
      case 'month':
        if (diffDays > 30) return false;
        break;
      case 'year':
        if (diffDays > 365) return false;
        break;
    }
    
    // Filter by confidence level
    const confidenceLevel = 
      prediction.confidence < 80 ? 'low' : 
      prediction.confidence < 90 ? 'medium' : 'high';
    
    if (!filters.confidenceLevel.includes(confidenceLevel)) return false;
    
    // Filter by ingredient count
    const ingredientCount = prediction.ingredients.length;
    if (ingredientCount < filters.ingredientCount[0] || ingredientCount > filters.ingredientCount[1]) return false;
    
    // Filter by saved amount
    if (prediction.saved < filters.savedAmount[0] || prediction.saved > filters.savedAmount[1]) return false;
    
    return true;
  });
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  return (
    <PageLayout title="Dashboard">
      <FilterBar onFilterChange={handleFilterChange} className="mb-6" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ChartSection />
        </div>
        <div className="lg:col-span-1">
          <EventsList />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Predictions</h2>
        {filteredPredictions.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 text-center py-8"
          >
            No predictions match your current filters
          </motion.p>
        )}
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPredictions.map((prediction, index) => (
          <PredictionCard key={prediction.id} prediction={prediction} index={index} />
        ))}
      </div>
    </PageLayout>
  );
};

export default Dashboard;