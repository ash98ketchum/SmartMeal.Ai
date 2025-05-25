import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockPredictions } from '../data/mockData';

const History: React.FC = () => {
  // Group predictions by their date string into an object
  const groupedPredictions = mockPredictions.reduce((acc: Record<string, typeof mockPredictions>, prediction) => {
    const date = prediction.date;
    if (!acc[date]) acc[date] = [];  // Initialize array if not present
    acc[date].push(prediction);       // Add current prediction to the date's array
    return acc;
  }, {});

  // Extract and sort the date keys in descending order (newest first)
  const sortedDates = Object.keys(groupedPredictions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <PageLayout title="Prediction History">
      {/* Search bar and control buttons container with glass effect */}
      <div className="mb-6 glass-panel p-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          {/* Search input with search icon inside input field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search predictions..."
              className="bg-midnight-700 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan"
            />
          </div>
          
          {/* Buttons for date range selector and exporting data */}
          <div className="flex items-center gap-2">
            <Button 
              variant="transparent" 
              className="flex items-center"
            >
              <Calendar size={16} className="mr-2" />
              Date Range
            </Button>
            <Button variant="cyan">Export Data</Button>
          </div>
        </div>
      </div>
      
      {/* List of grouped prediction cards by date */}
      <div className="space-y-8">
        {sortedDates.map((date, dateIndex) => (
          <motion.div 
            key={date}
            // Animate date section with fade in and slide up effect, staggered by date index
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIndex * 0.1, duration: 0.5 }}
          >
            {/* Display the date in a readable full format */}
            <h2 className="text-lg font-medium mb-4">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            
            {/* Cards for each prediction under the current date */}
            <div className="space-y-4">
              {groupedPredictions[date].map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  // Animate each card with fade in and slide from left effect, staggered by index
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (index * 0.05), duration: 0.4 }}
                >
                  {/* Card component to hold prediction details */}
                  <Card className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      {/* Left side: image and basic details */}
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md overflow-hidden">
                          <img 
                            src={prediction.imageUrl} 
                            alt={prediction.dishName} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{prediction.dishName}</h3>
                          <p className="text-sm text-gray-400">
                            {prediction.ingredients.length} ingredients • ${prediction.saved.toFixed(2)} saved
                          </p>
                        </div>
                      </div>
                      
                      {/* Right side: predicted/actual values and details button */}
                      <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm flex flex-col sm:flex-row sm:gap-3">
                            <span className="text-neon-cyan">
                              Predicted: ${prediction.predictedValue.toFixed(2)}
                            </span>
                            <span className="text-neon-magenta">
                              Actual: ${prediction.actualValue.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <Button variant="transparent" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default History;
