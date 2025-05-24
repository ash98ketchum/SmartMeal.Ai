import type { Prediction, Metric, TimelineEvent, ChartData } from '../types';
import { 
  TrendingUp, 
  Carrot, 
  DollarSign, 
  BarChart,
  Clock,
  Scale,
  Utensils,
  RefreshCcw
} from 'lucide-react';

export const mockPredictions: Prediction[] = [
  {
    id: '1',
    dishName: 'Grilled Salmon Bowl',
    confidence: 97,
    actualValue: 540,
    predictedValue: 520,
    ingredients: ['Salmon', 'Brown rice', 'Avocado', 'Sesame seeds', 'Soy sauce'],
    date: new Date().toISOString(), // Today
    saved: 15.60,
    imageUrl: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '2',
    dishName: 'Vegan Burrito',
    confidence: 89,
    actualValue: 720,
    predictedValue: 690,
    ingredients: ['Beans', 'Rice', 'Guacamole', 'Salsa', 'Tortilla'],
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    saved: 12.25,
    imageUrl: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '3',
    dishName: 'Chicken Tikka Masala',
    confidence: 94,
    actualValue: 810,
    predictedValue: 830,
    ingredients: ['Chicken', 'Yogurt', 'Tomato sauce', 'Garam masala', 'Rice'],
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    saved: 18.40,
    imageUrl: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '4',
    dishName: 'Mediterranean Salad',
    confidence: 77,
    actualValue: 320,
    predictedValue: 380,
    ingredients: ['Cucumber', 'Tomato', 'Feta', 'Olives', 'Olive oil'],
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    saved: 8.75,
    imageUrl: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '5',
    dishName: 'Beef Stir Fry',
    confidence: 91,
    actualValue: 680,
    predictedValue: 670,
    ingredients: ['Beef strips', 'Bell peppers', 'Broccoli', 'Soy sauce', 'Ginger', 'Garlic', 'Sesame oil'],
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    saved: 14.30,
    imageUrl: 'https://images.pexels.com/photos/3926133/pexels-photo-3926133.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '6',
    dishName: 'Veggie Pizza',
    confidence: 86,
    actualValue: 750,
    predictedValue: 790,
    ingredients: ['Dough', 'Tomato sauce', 'Mozzarella', 'Bell peppers', 'Mushrooms', 'Olives', 'Basil'],
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    saved: 10.90,
    imageUrl: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '7',
    dishName: 'Sushi Platter',
    confidence: 95,
    actualValue: 890,
    predictedValue: 870,
    ingredients: ['Sushi rice', 'Fresh tuna', 'Salmon', 'Nori', 'Avocado', 'Cucumber', 'Wasabi', 'Soy sauce'],
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    saved: 22.50,
    imageUrl: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '8',
    dishName: 'Thai Green Curry',
    confidence: 88,
    actualValue: 650,
    predictedValue: 680,
    ingredients: ['Coconut milk', 'Green curry paste', 'Chicken', 'Bamboo shoots', 'Thai basil', 'Fish sauce', 'Lime leaves'],
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    saved: 16.75,
    imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=300',
  },
  {
    id: '9',
    dishName: 'Moroccan Tagine',
    confidence: 92,
    actualValue: 580,
    predictedValue: 595,
    ingredients: ['Lamb', 'Couscous', 'Apricots', 'Chickpeas', 'Moroccan spices', 'Almonds', 'Honey', 'Preserved lemon'],
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    saved: 19.20,
    imageUrl: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=300',
  }
];

export const getMetrics = (): Metric[] => [
  {
    id: '1',
    name: 'Accuracy Rate',
    value: 92.7,
    change: 2.4,
    unit: '%',
    icon: 'TrendingUp',
  },
  {
    id: '2',
    name: 'Ingredients Saved',
    value: 146,
    change: 12,
    icon: 'Carrot',
  },
  {
    id: '3',
    name: 'Amount Saved',
    value: 1280.5,
    change: 215.8,
    unit: '$',
    icon: 'DollarSign',
  },
  {
    id: '4',
    name: 'Successful Predictions',
    value: 284,
    change: 32,
    icon: 'BarChart',
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'Weekly Prediction Summary',
    description: 'Review the summary of all predictions from last week',
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    type: 'prediction',
    status: 'pending',
  },
  {
    id: '2',
    title: 'AI Model Update',
    description: 'The prediction algorithm will be updated with new training data',
    date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    type: 'update',
    status: 'pending',
  },
  {
    id: '3',
    title: '1000th Prediction Milestone',
    description: 'Approaching a major milestone in predictions!',
    date: new Date(Date.now() + 86400000 * 8).toISOString(), // 8 days from now
    type: 'milestone',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Monthly System Maintenance',
    description: 'Scheduled downtime for system updates',
    date: new Date(Date.now() + 86400000 * 12).toISOString(), // 12 days from now
    type: 'update',
    status: 'pending',
  },
];

export const chartData: ChartData[] = [
  { name: 'Jan', predicted: 450, actual: 470 },
  { name: 'Feb', predicted: 520, actual: 500 },
  { name: 'Mar', predicted: 640, actual: 650 },
  { name: 'Apr', predicted: 780, actual: 760 },
  { name: 'May', predicted: 810, actual: 830 },
  { name: 'Jun', predicted: 720, actual: 740 },
  { name: 'Jul', predicted: 680, actual: 670 },
];

export const iconMap = {
  TrendingUp,
  Carrot,
  DollarSign,
  BarChart,
  Clock,
  Scale,
  Utensils,
  RefreshCcw
};

export const getConfidenceLevel = (confidence: number): 'low' | 'medium' | 'high' => {
  if (confidence < 80) return 'low';
  if (confidence < 90) return 'medium';
  return 'high';
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence < 80) return 'text-neon-orange';
  if (confidence < 90) return 'text-neon-cyan';
  return 'text-neon-magenta';
};

export const getConfidenceBorderColor = (confidence: number): string => {
  if (confidence < 80) return 'neon-border-orange';
  if (confidence < 90) return 'neon-border-cyan';
  return 'neon-border-magenta';
};

export const getTotalSaved = (): number => {
  return mockPredictions.reduce((total, prediction) => total + prediction.saved, 0);
};

export const getAverageAccuracy = (): number => {
  const accuracySum = mockPredictions.reduce((sum, prediction) => {
    const accuracy = 100 - Math.abs((prediction.actualValue - prediction.predictedValue) / prediction.actualValue * 100);
    return sum + accuracy;
  }, 0);
  return accuracySum / mockPredictions.length;
};