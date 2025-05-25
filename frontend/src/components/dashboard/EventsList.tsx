// Import necessary libraries and components
import React from 'react';
// For animations
import { motion } from 'framer-motion';
// Clock icon
import { Clock } from 'lucide-react';
// Reusable card component
import Card from '../ui/Card';


// Define the structure of each event item
export interface EventItem {
  id: string;
  title: string;
  description?: string;
  // ISO format date string
  date: string; 
}


// Define the props for the EventsList component
interface EventsListProps {
  // Array of event data
  events: EventItem[];
  // Optional custom class name
  className?: string;
}


// Functional component to render the events list
const EventsList: React.FC<EventsListProps> = ({ events, className = '' }) => {

  // Function to calculate time difference between now and the event date
  const renderStatus = (eventDate: string) => {
    const now = new Date();
    const diff = new Date(eventDate).getTime() - now.getTime();

    // If the event has already passed
    if (diff < 0) return 'Past';

    // Calculate remaining days and hours
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    
    // Return formatted time left
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  };


  // Render fallback UI if there are no upcoming events
  if (!events.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card className="p-4 md:p-6" glow>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-500">No upcoming events</p>
        </Card>
      </motion.div>
    );
  }


  // Render list of events
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={className}
    >
      <Card className="p-4 md:p-6" glow>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <Clock size={18} className="mr-2 text-green-600" />
          Upcoming Events
        </h2>

        <div className="space-y-4">
          {events.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              className="
                flex flex-col p-4 bg-white rounded-2xl border border-green-200
                shadow-sm transition-transform hover:scale-[1.01]
              "
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">{evt.title}</h3>
                <div className="text-xs bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">
                  {renderStatus(evt.date)}
                </div>
              </div>

              {evt.description && (
                <p className="text-gray-600 text-sm mt-1">{evt.description}</p>
              )}

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


// Export the component for use elsewhere
export default EventsList;
