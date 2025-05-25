// src/pages/Dashboard.tsx
import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import ParticleBackground from '../components/layout/ParticleBackground';
import MetricCard from '../components/dashboard/MetricCard';
import PredictionCard from '../components/dashboard/PredictionCard';
import ChartSection from '../components/dashboard/ChartSection';
import EventsList from '../components/dashboard/EventsList';
import FilterBar from '../components/dashboard/FilterBar';
import { FilterOptions } from '../types';

interface EventItem {
  id: string;
  title: string;
  date: string;
  description?: string;
}

const Dashboard: React.FC = () => {
  // ─── Prediction Filters ────────────────────────────────
  const [filters, setFilters] = React.useState<FilterOptions>({
    dateRange: 'week',
    confidenceLevel: ['medium', 'high'],
    ingredientCount: [3, 7],
    savedAmount: [5, 20],
  });

  // ─── Upcoming Events ────────────────────────────────────
  const [events, setEvents] = React.useState<EventItem[]>([]);
  React.useEffect(() => {
    async function loadEvents() {
      try {
        const res = await axios.get<EventItem[]>('/api/events');
        const now = new Date();
        const upcoming = res.data
          .filter(evt => new Date(evt.date) >= new Date(now.toDateString()))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4);
        setEvents(upcoming);
      } catch (err) {
        console.error('Failed to fetch events', err);
      }
    }
    loadEvents();
  }, []);

  // ─── Handlers ─────────────────────────────────────────
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <PageLayout title="Dashboard">
      {/* Page-specific leaves behind content */}
      <ParticleBackground className="absolute inset-0 z-0 opacity-50" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Filter bar */}
        <FilterBar onFilterChange={handleFilterChange} className="mb-6" />

        {/* Metric cards */}
        <div className="mb-8">
          <MetricCard />
        </div>

        {/* Chart + Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ChartSection />
          </div>
          <div className="lg:col-span-1">
            <EventsList events={events} />
          </div>
        </div>

        {/* Recent Predictions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Recent Predictions
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-center py-8"
          >
            No predictions match your current filters.
          </motion.p>
        </motion.div>

        {/* Prediction cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/** Integrate PredictionCard list here **/}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
