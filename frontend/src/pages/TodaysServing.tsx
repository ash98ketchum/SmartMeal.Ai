// src/pages/TodaysServing.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import ParticleBackground from '../components/layout/ParticleBackground';
import { Plus, Trash, Database } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Interface representing a serving entry with all its properties
interface Serving {
  name: string;
  costPerPlate: number;
  totalIngredientsCost: number;
  totalPlates: number;
  platesWasted: number;
  totalEarning: number;
  remark?: string;
}

// Interface representing form state fields for controlled inputs
interface FormState {
  name: string;
  customName: string;
  costPerPlate: string;
  totalIngredientsCost: string;
  totalPlates: string;
  platesWasted: string;
  remark: string;
}

// List of common dishes shown in dropdown for quick selection
const commonDishes = [
  "Paneer Butter Masala", "Chole Bhature", "Masala Dosa", "Biryani", "Rajma Chawal", "Aloo Paratha",
  "Butter Chicken", "Dal Makhani", "Idli Sambhar", "Pav Bhaji", "Pani Puri", "Kadhi Chawal",
  "Vegetable Pulao", "Samosa", "Dhokla", "Chicken Tikka Masala", "Fish Curry", "Matar Paneer",
  "Palak Paneer", "Egg Curry", "Naan", "Roti", "Paratha", "Keema Pulao", "Veg Fried Rice",
  "Egg Fried Rice", "Gulab Jamun", "Ras Malai", "Kheer", "Lassi", "Masala Chai", "Other"
];

const TodaysServing: React.FC = () => {
  // State to store all servings fetched from backend
  const [servings, setServings] = useState<Serving[]>([]);

  // State to hold form input values for adding a new serving
  const [form, setForm] = useState<FormState>({
    name: '', customName: '', costPerPlate: '', totalIngredientsCost: '',
    totalPlates: '', platesWasted: '', remark: ''
  });

  // Fetch existing servings once component mounts
  useEffect(() => { fetchServings(); }, []);

  // Function to fetch serving data from API and update state
  const fetchServings = async () => {
    try {
      const res = await axios.get<Serving[]>('/api/servings');
      setServings(res.data);
    } catch {
      setServings([]); // On error, reset to empty array
    }
  };

  // Generic change handler for form inputs (including select)
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Function to add a new serving entry after validation
  const addServing = async () => {
    // Parse numeric inputs
    const costPerPlate = parseFloat(form.costPerPlate);
    const totalIngredientsCost = parseFloat(form.totalIngredientsCost);
    const totalPlates = parseInt(form.totalPlates, 10);
    const platesWasted = parseInt(form.platesWasted, 10);

    // Validate inputs are numbers and total plates > 0
    if ([costPerPlate, totalIngredientsCost, totalPlates, platesWasted].some(isNaN) || totalPlates <= 0) {
      alert('Please enter valid numbers and ensure total plates > 0.');
      return;
    }

    // Construct the new Serving object
    const newServing: Serving = {
      name: form.name === 'Other' ? form.customName : form.name,
      costPerPlate,
      totalIngredientsCost,
      totalPlates,
      platesWasted,
      // Calculate total earning: (price per plate - ingredient cost per plate) * plates sold (excluding wasted)
      totalEarning: (costPerPlate - totalIngredientsCost / totalPlates) * (totalPlates - platesWasted),
      remark: form.remark || undefined
    };

    // Send POST request to save the new serving
    await axios.post('/api/servings', newServing);

    // Reset form fields after adding serving
    setForm({ name: '', customName: '', costPerPlate: '', totalIngredientsCost: '', totalPlates: '', platesWasted: '', remark: '' });

    // Refresh servings list from server
    fetchServings();
  };

  // Function to remove a serving by name
  const removeServing = async (name: string) => {
    await axios.delete(`/api/servings/${encodeURIComponent(name)}`);
    fetchServings();
  };

  // Function to archive today's data for model training with confirmation prompt
  const archiveForModel = async () => {
    if (!window.confirm("Archive today’s data for model training?")) return;
    try {
      await axios.post('/api/archive');
      alert("Archived!");
    } catch {
      alert("Archive failed.");
    }
  };

  // Prepare summary items for display cards: total earnings, food waste cost, net savings
  const summaryItems = [
    { title: 'Total Earnings', value: `$${servings.reduce((sum, s) => sum + s.totalEarning, 0).toFixed(2)}` },
    { title: 'Food Waste',    value: `$${servings.reduce((sum, s) => sum + s.platesWasted * s.costPerPlate, 0).toFixed(2)}` },
    { title: 'Net Savings',   value: `$${(servings.reduce((sum, s) => sum + s.totalEarning, 0) - servings.reduce((sum, s) => sum + s.platesWasted * s.costPerPlate, 0)).toFixed(2)}` }
  ];

  // Define form fields to render for numeric and remark inputs
  const formFields = [
    { label: 'Cost Per Plate ($)', name: 'costPerPlate', type: 'number', placeholder: '0.00' },
    { label: 'Total Ingredients Cost ($)', name: 'totalIngredientsCost', type: 'number', placeholder: '0.00' },
    { label: 'Total Plates', name: 'totalPlates', type: 'number', placeholder: '0' },
    { label: 'Plates Wasted', name: 'platesWasted', type: 'number', placeholder: '0' },
    { label: 'Remark', name: 'remark', type: 'text', placeholder: 'Optional remark' }
  ];

  return (
    <PageLayout title="Today's Serving">
      {/* Background particles for visual effect */}
      <ParticleBackground className="absolute inset-0 z-0 opacity-50" />
      <div className="relative z-10 space-y-8 p-6">

        {/* Button to archive today's data for model training */}
        <div className="flex justify-end">
          <Button variant="outline" size="md" onClick={archiveForModel}>
            <Database size={18} className="mr-2" /> Save Data for Model Training
          </Button>
        </div>

        {/* Summary cards for earnings, waste, and net savings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryItems.map(({ title, value }, idx) => (
            <Card key={idx} className="p-6 text-center bg-gray-100" glow={false}>
              <h4 className="text-lg font-medium text-gray-700">{title}</h4>
              <p className="text-2xl font-bold text-green-600 mt-2">{value}</p>
            </Card>
          ))}
        </div>

        {/* Display list of servings with details and delete button */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servings.map((s, idx) => (
            <Card key={idx} className="p-6 relative bg-gray-100" glow={false}>
              {/* Button to delete a serving */}
              <button onClick={() => removeServing(s.name)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                <Trash size={18} />
              </button>

              {/* Serving details */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{s.name}</h3>
              <p className="text-gray-600">Made: {s.totalPlates}</p>
              <p className="text-gray-600">Wasted: {s.platesWasted}</p>
              <p className="text-gray-600">Cost: ${s.totalIngredientsCost.toFixed(2)}</p>
              <p className="text-gray-600">Earned: ${s.totalEarning.toFixed(2)}</p>
              {s.remark && <p className="italic text-sm text-gray-500 mt-2">“{s.remark}”</p>}
            </Card>
          ))}
        </div>

        {/* Form card for adding a new serving */}
        <Card className="p-8 bg-gray-100" glow={false}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Serving</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dish selection dropdown */}
            <div>
              <label className="block text-gray-700 mb-1">Dish Name</label>
              <select
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full text-black placeholder-black border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
              >
                <option value="" disabled>Select a Dish</option>
                {commonDishes.map(dish => (
                  <option key={dish} value={dish}>{dish}</option>
                ))}
              </select>
            </div>

            {/* Custom dish name input shown only if 'Other' is selected */}
            {form.name === 'Other' && (
              <div>
                <label className="block text-gray-700 mb-1">Custom Dish Name</label>
                <input
                  type="text"
                  name="customName"
                  value={form.customName}
                  onChange={handleChange}
                  placeholder="Enter custom dish name"
                  className="w-full text-black placeholder-black border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
                />
              </div>
            )}

            {/* Render other numeric and remark input fields dynamically */}
            {formFields.map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  className="w-full text-black placeholder-black border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
                />
              </div>
            ))}
          </div>

          {/* Button to submit and add the serving */}
          <div className="mt-6">
            <Button variant="solid" size="md" onClick={addServing}>
              <Plus size={18} className="mr-2" /> Add Serving
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TodaysServing;
