import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles, RefreshCcw } from 'lucide-react';
import Card from '../ui/Card';
import { TimelineEvent } from '../../types';
import { timelineEvents } from '../../data/mockData';

interface EventsListProps {
  className?: string;
  limit?: number;
}

const EventsList: React.FC<EventsListProps> = ({ className = '', limit = 4 }) => {
  const events = limit ? timelineEvents.slice(0, limit) : timelineEvents;
  
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'prediction': return <Clock size={16} />;
      case 'milestone': return <Sparkles size={16} />;
      case 'update': return <RefreshCcw size={16} />;
    }
  };
  
  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'prediction': return 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20';
      case 'milestone': return 'bg-neon-magenta/10 text-neon-magenta border-neon-magenta/20';
      case 'update': return 'bg-neon-violet/10 text-neon-violet border-neon-violet/20';
    }
  };
  
  const getTimeRemaining = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffMs = eventDate.getTime() - now.getTime();
    
    // If event is in the past
    if (diffMs < 0) return 'Past';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else {
      return `${diffHours}h`;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={className}
    >
      <Card className="p-4 md:p-6" glowColor="magenta">
        <h2 className="text-lg md:text-xl font-semibold mb-6">Upcoming Events</h2>
        
        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="flex gap-3"
            >
              <div className={`mt-1 p-2 rounded-md border ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{event.title}</h3>
                  <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ 
                      opacity: [0.6, 1, 0.6],
                      transition: { 
                        repeat: Infinity, 
                        duration: 2
                      }
                    }}
                    className="text-xs bg-midnight-400 px-2 py-0.5 rounded-md"
                  >
                    {getTimeRemaining(event.date)}
                  </motion.div>
                </div>
                <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className={`
                    text-xs px-1.5 py-0.5 rounded 
                    ${event.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                      event.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' : 
                      'bg-green-500/10 text-green-400'}
                  `}>
                    {event.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default EventsList;