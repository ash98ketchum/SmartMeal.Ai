import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Card from '../ui/Card';

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string;         // ISO string
}

interface EventsListProps {
  events: EventItem[];
  className?: string;
}

const EventsList: React.FC<EventsListProps> = ({ events, className = '' }) => {
  const renderStatus = (eventDate: string) => {
    const now = new Date();
    const diff = new Date(eventDate).getTime() - now.getTime();
    if (diff < 0) return 'Past';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  };

  if (!events.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card className="p-4 md:p-6" glowColor="cyan">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Upcoming Events</h2>
          <p className="text-gray-500">No upcoming events</p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={className}
    >
      <Card className="p-4 md:p-6" glowColor="cyan">
        <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center">
          <Clock size={18} className="mr-2 text-neon-cyan" />
          Upcoming Events
        </h2>

        <div className="space-y-4">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              className="flex flex-col p-4 bg-midnight-800/70 rounded-2xl border border-cyan-500/20 backdrop-blur-sm shadow-lg transition-all hover:scale-[1.01]"

            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-white">{evt.title}</h3>
                <div className="text-xs bg-midnight-400 px-2 py-0.5 rounded-md text-gray-300">
                  {renderStatus(evt.date)}
                </div>
              </div>

              {evt.description && <p className="text-gray-400 text-sm mt-1">{evt.description}</p>}

              <div className="mt-2 text-xs text-gray-500">
                {new Date(evt.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default EventsList;