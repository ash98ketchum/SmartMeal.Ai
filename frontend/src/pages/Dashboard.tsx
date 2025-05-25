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
  // State to keep track of the filters applied to predictions
  const [filters, setFilters] = React.useState<FilterOptions>({
    dateRange: 'week',                  // Filter predictions from the past week by default
    confidenceLevel: ['medium', 'high'], // Show medium and high confidence predictions
    ingredientCount: [3, 7],            // Filter by number of ingredients between 3 and 7
    savedAmount: [5, 20],               // Filter predictions that saved between 5 and 20 units
  });

  // ─── Upcoming Events ────────────────────────────────────
  // State to store upcoming event items fetched from an API
  const [events, setEvents] = React.useState<EventItem[]>([]);

  React.useEffect(() => {
    // Async function to fetch upcoming events from backend API
    async function loadEvents() {
      try {
        // Fetch events from /api/events endpoint
        const res = await axios.get<EventItem[]>('/api/events');
        const now = new Date();

        // Filter events to only those that are today or later
        // and sort them by date ascending
        const upcoming = res.data
          .filter(evt => new Date(evt.date) >= new Date(now.toDateString()))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4);  // Limit to 4 upcoming events

        setEvents(upcoming);
      } catch (err) {
        // Log error if fetching fails
        console.error('Failed to fetch events', err);
      }
    }
    loadEvents();
  }, []); // Empty dependency array means this effect runs once on component mount

  // ─── Handlers ─────────────────────────────────────────
  // Handler to update filters when user changes filter options
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <PageLayout title="Dashboard">
      {/* Background particles with reduced opacity, placed behind the content */}
      <ParticleBackground className="absolute inset-0 z-0 opacity-50" />

      {/* Main content container, positioned above the background */}
      <div className="relative z-10">
        {/* Filter bar component with a callback to handle filter changes */}
        <FilterBar onFilterChange={handleFilterChange} className="mb-6" />

        {/* Metrics section showing summary cards */}
        <div className="mb-8">
          <MetricCard />
        </div>

        {/* Grid layout for ChartSection and EventsList side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart section takes up two-thirds of the grid on large screens */}
          <div className="lg:col-span-2">
            <ChartSection />
          </div>

          {/* Events list takes up one-third of the grid */}
          <div className="lg:col-span-1">
            <EventsList events={events} />
          </div>
        </div>

        {/* Recent Predictions header and message, with fade-in animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Recent Predictions
          </h2>
          {/* Message shown when no predictions match the current filters */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-center py-8"
          >
            No predictions match your current filters.
          </motion.p>
        </motion.div>

        {/* Container for PredictionCard components displayed in a responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/** Integrate PredictionCard list here **/}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
