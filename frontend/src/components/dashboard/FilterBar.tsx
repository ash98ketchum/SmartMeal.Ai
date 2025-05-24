import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, X } from 'lucide-react';
import { FilterOptions, ConfidenceLevel } from '../../types';
import Button from '../ui/Button';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'week',
    confidenceLevel: ['medium', 'high'],
    ingredientCount: [3, 7],
    savedAmount: [5, 20]
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>(['dateRange', 'confidenceLevel']);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    // Update active filters
    if (!activeFilters.includes(key)) {
      setActiveFilters([...activeFilters, key]);
    }
  };
  
  const removeFilter = (key: string) => {
    setActiveFilters(activeFilters.filter(filter => filter !== key));
    
    // Reset the filter to default
    if (key === 'dateRange') handleFilterChange('dateRange', 'week');
    if (key === 'confidenceLevel') handleFilterChange('confidenceLevel', ['medium', 'high']);
    if (key === 'ingredientCount') handleFilterChange('ingredientCount', [3, 7]);
    if (key === 'savedAmount') handleFilterChange('savedAmount', [5, 20]);
  };
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  // Filter dropdown variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      transition: { duration: 0.2 } 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        staggerChildren: 0.05 
      } 
    }
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
          className="flex items-center"
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
              className="flex items-center px-2 py-1 rounded-md bg-glass text-xs"
            >
              {filter === 'dateRange' && (
                <span>Time: {filters.dateRange}</span>
              )}
              {filter === 'confidenceLevel' && (
                <span>Confidence: {filters.confidenceLevel.join(', ')}</span>
              )}
              {filter === 'ingredientCount' && (
                <span>Ingredients: {filters.ingredientCount[0]}-{filters.ingredientCount[1]}</span>
              )}
              {filter === 'savedAmount' && (
                <span>Savings: ${filters.savedAmount[0]}-${filters.savedAmount[1]}</span>
              )}
              <button 
                onClick={() => removeFilter(filter)}
                className="ml-1 p-0.5 hover:text-neon-cyan focus:outline-none"
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
            className="absolute z-50 left-0 mt-2 w-72 glass-panel p-4 divide-y divide-white/10"
          >
            <motion.div variants={filterItemVariants} className="pb-3">
              <h3 className="text-sm font-medium mb-2">Time Range</h3>
              <div className="grid grid-cols-4 gap-2">
                {['today', 'week', 'month', 'year'].map(range => (
                  <button
                    key={range}
                    onClick={() => handleFilterChange('dateRange', range)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      filters.dateRange === range 
                        ? 'bg-neon-cyan/20 text-neon-cyan' 
                        : 'bg-glass-hover text-gray-300'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={filterItemVariants} className="py-3">
              <h3 className="text-sm font-medium mb-2">Confidence Level</h3>
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
                        ? level === 'low' 
                          ? 'bg-neon-orange/20 text-neon-orange' 
                          : level === 'medium'
                            ? 'bg-neon-cyan/20 text-neon-cyan'
                            : 'bg-neon-magenta/20 text-neon-magenta'
                        : 'bg-glass-hover text-gray-300'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
            
            <div className="pt-3 flex justify-end">
              <Button size="sm" variant="magenta" onClick={() => setIsOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;