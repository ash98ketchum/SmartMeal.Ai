export interface Prediction {
  id: string;
  dishName: string;
  confidence: number;
  actualValue: number;
  predictedValue: number;
  ingredients: string[];
  date: string;
  saved: number;
  imageUrl: string;
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  change: number;
  unit?: string;
  icon: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'update' | 'prediction' | 'milestone';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ChartData {
  name: string;
  predicted: number;
  actual: number;
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface FilterOptions {
  dateRange: 'today' | 'week' | 'month' | 'year';
  confidenceLevel: ConfidenceLevel[];
  ingredientCount: number[];
  savedAmount: [number, number];
}