// Represents a prediction result for a dish
export interface Prediction {
  id: string;                  // Unique identifier for the prediction
  dishName: string;            // Name of the predicted dish
  confidence: number;          // Confidence score (0 to 1 or percentage)
  actualValue: number;         // Actual/ground-truth value (e.g., rating or score)
  predictedValue: number;      // Predicted value from the model
  ingredients: string[];       // List of ingredients used for the prediction
  date: string;                // ISO date string when the prediction was made
  saved: number;               // Number of times this prediction was saved/bookmarked
  imageUrl: string;            // URL of the dish image
}

// Represents a dashboard metric (e.g., total predictions, accuracy, etc.)
export interface Metric {
  id: string;                  // Unique identifier for the metric
  name: string;                // Metric name (e.g., "Accuracy", "Total Predictions")
  value: number;               // Current value of the metric
  change: number;              // Change in metric value compared to previous period
  unit?: string;               // Optional unit (%, count, etc.)
  icon: string;                // Icon name (used for display purposes)
}

// Represents an event in a timeline (updates, predictions, or milestones)
export interface TimelineEvent {
  id: string;                                              // Unique event ID
  title: string;                                           // Title of the event
  description: string;                                     // Detailed description
  date: string;                                            // ISO date string
  type: 'update' | 'prediction' | 'milestone';             // Type/category of the event
  status: 'pending' | 'in-progress' | 'completed';         // Current status of the event
}

// Data structure used for charting predicted vs. actual values
export interface ChartData {
  name: string;               // Label (e.g., date or dish name)
  predicted: number;          // Predicted value for that point
  actual: number;             // Actual observed value
}

// Enum-like type for prediction confidence levels
export type ConfidenceLevel = 'low' | 'medium' | 'high';

// Filters used for querying or visualizing prediction data
export interface FilterOptions {
  dateRange: 'today' | 'week' | 'month' | 'year'; // Time filter
  confidenceLevel: ConfidenceLevel[];             // Array of selected confidence levels
  ingredientCount: number[];                      // Array of selected ingredient count filters
  savedAmount: [number, number];                  // Range filter for saved count [min, max]
}
