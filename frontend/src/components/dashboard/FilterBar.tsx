import React, { useState } from 'react';
// Animation tools from Framer Motion
import { motion, AnimatePresence } from 'framer-motion';
// Icon components
import { Filter, ChevronDown, X } from 'lucide-react';
// Type definitions
import { FilterOptions, ConfidenceLevel } from '../../types';
// Reusable button component
import Button from '../ui/Button';


// Props interface for FilterBar
interface FilterBarProps {
  // Callback when filters are changed
  onFilterChange: (filters: FilterOptions) => void;
  // Optional styling class
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, className = '' }) => {
  // Toggle state for opening/closing dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Stores current filter values
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'week',
    confidenceLevel: ['medium', 'high'],
    ingredientCount: [3, 7],
    savedAmount: [5, 20]
  });


  // Tracks which filters are actively shown as chips
  const [activeFilters, setActiveFilters] = useState<string[]>(['dateRange', 'confidenceLevel']);


  // Handles filter update and notifies parent component
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    if (!activeFilters.includes(key)) {
      setActiveFilters([...activeFilters, key]);
    }
  };


  // Removes a filter and resets it to default values
  const removeFilter = (key: string) => {
    setActiveFilters(activeFilters.filter(f => f !== key));
    if (key === 'dateRange') handleFilterChange('dateRange', 'week');
    if (key === 'confidenceLevel') handleFilterChange('confidenceLevel', ['medium', 'high']);
    if (key === 'ingredientCount') handleFilterChange('ingredientCount', [3, 7]);
    if (key === 'savedAmount') handleFilterChange('savedAmount', [5, 20]);
  };


  // Toggles dropdown open/close
  const toggleOpen = () => setIsOpen(!isOpen);


  // Framer Motion animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.05 } }
  };

  const filterItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button
          variant="transparent"
          size="sm"
          className="flex items-center border-green-200 text-green-600"
          onClick={toggleOpen}
        >
          <Filter size={16} className="mr-1" />
          Filters
          <ChevronDown
            size={14}
            className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        <AnimatePresence>
          {activeFilters.map(filter => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
              className="flex items-center px-2 py-1 rounded-md bg-white/20 text-gray-600 text-xs"
            >
              {filter === 'dateRange' && <span>Time: {filters.dateRange}</span>}
              {filter === 'confidenceLevel' && (
                <span>Confidence: {filters.confidenceLevel.join(', ')}</span>
              )}
              {filter === 'ingredientCount' && (
                <span>
                  Ingredients: {filters.ingredientCount[0]}-
                  {filters.ingredientCount[1]}
                </span>
              )}
              {filter === 'savedAmount' && (
                <span>
                  Savings: ${filters.savedAmount[0]}-
                  {filters.savedAmount[1]}
                </span>
              )}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 p-0.5 hover:text-green-600 focus:outline-none"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="absolute z-50 left-0 mt-2 w-72 bg-white/50 backdrop-blur-sm p-4 divide-y divide-gray-200 rounded-md shadow-lg"
          >
            <motion.div variants={filterItemVariants} className="pb-3">
              <h3 className="text-sm font-medium mb-2 text-gray-800">Time Range</h3>
              <div className="grid grid-cols-4 gap-2">
                {['today', 'week', 'month', 'year'].map(range => (
                  <button
                    key={range}
                    onClick={() => handleFilterChange('dateRange', range)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      filters.dateRange === range
                        ? 'bg-green-100 text-green-600'
                        : 'bg-white/10 text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={filterItemVariants} className="py-3">
              <h3 className="text-sm font-medium mb-2 text-gray-800">Confidence Level</h3>
              <div className="flex flex-wrap gap-2">
                {(['low', 'medium', 'high'] as ConfidenceLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => {
                      const newLevels = filters.confidenceLevel.includes(level)
                        ? filters.confidenceLevel.filter(l => l !== level)
                        : [...filters.confidenceLevel, level];
                      handleFilterChange('confidenceLevel', newLevels);
                    }}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      filters.confidenceLevel.includes(level)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-white/10 text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="pt-3 flex justify-end">
              <Button size="sm" variant="solid" onClick={() => setIsOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// Export the component for use elsewhere
export default FilterBar;
