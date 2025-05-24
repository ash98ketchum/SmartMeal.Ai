import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import { Plus, Trash, Database } from 'lucide-react';
import Button from '../components/ui/Button';

interface Serving {
  name: string;
  costPerPlate: number;
  totalIngredientsCost: number;
  totalPlates: number;
  platesWasted: number;
  totalEarning: number;
  remark?: string;
}

interface FormState {
  name: string;
  customName: string;
  costPerPlate: string;
  totalIngredientsCost: string;
  totalPlates: string;
  platesWasted: string;
  remark: string;
}

const commonDishes = [
  "Paneer Butter Masala",
  "Chole Bhature",
  "Masala Dosa",
  "Biryani",
  "Rajma Chawal",
  "Aloo Paratha",
  "Butter Chicken",
  "Dal Makhani",
  "Idli Sambhar",
  "Pav Bhaji",
  "Pani Puri",
  "Kadhi Chawal",
  "Vegetable Pulao",
  "Samosa",
  "Dhokla",
  "Other"
];

const TodaysServing: React.FC = () => {
  const [servings, setServings] = useState<Serving[]>([]);
  const [form, setForm] = useState<FormState>({
    name: '',
    customName: '',
    costPerPlate: '',
    totalIngredientsCost: '',
    totalPlates: '',
    platesWasted: '',
    remark: '',
  });

  useEffect(() => {
    fetchServings();
  }, []);

  const fetchServings = async () => {
    try {
      const res = await axios.get<Serving[]>('/api/servings');
      setServings(res.data);
    } catch (err) {
      console.error('Failed to load servings', err);
      setServings([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addServing = async () => {
  const costPerPlate         = parseFloat(form.costPerPlate);
  const totalIngredientsCost = parseFloat(form.totalIngredientsCost);
  const totalPlates          = parseInt(form.totalPlates, 10);
  const platesWasted         = parseInt(form.platesWasted, 10);

  if (
    isNaN(costPerPlate) ||
    isNaN(totalIngredientsCost) ||
    isNaN(totalPlates) ||
    isNaN(platesWasted) ||
    totalPlates === 0
  ) {
    alert("Please enter valid numerical values and ensure total plates is not zero.");
    return;
  }

  const ingredientCostPerPlate = totalIngredientsCost / totalPlates;
  const netPlates = totalPlates - platesWasted;
  const totalEarning = (costPerPlate - ingredientCostPerPlate) * netPlates;

  const servingName = form.name === "Other" ? form.customName : form.name;

  const newServing: Serving = {
    name: servingName,
    costPerPlate,
    totalIngredientsCost,
    totalPlates,
    platesWasted,
    totalEarning,
    remark: form.remark || undefined,
  };

  await axios.post('/api/servings', newServing);
  setForm({
    name: '',
    customName: '',
    costPerPlate: '',
    totalIngredientsCost: '',
    totalPlates: '',
    platesWasted: '',
    remark: '',
  });
  fetchServings();
};


  const removeServing = async (name: string) => {
    await axios.delete(`/api/servings/${encodeURIComponent(name)}`);
    fetchServings();
  };

  const archiveForModel = async () => {
    if (!window.confirm("Archive today’s data for model training?")) return;
    try {
      await axios.post('/api/archive');
      alert("Today's data archived to dataformodel.json!");
    } catch (err) {
      console.error(err);
      alert("Failed to archive data. See console for details.");
    }
  };

  const totalToday = servings.reduce((sum, s) => sum + s.totalEarning, 0);
  const totalWaste = servings.reduce((sum, s) => sum + s.platesWasted * s.costPerPlate, 0);
  const cumulative = totalToday - totalWaste;

  return (
    <PageLayout title="TodaysServing">
      <div className="container mx-auto px-6 py-10">
        {/* Archive button */}
        <div className="flex justify-end mb-6">
          <Button
            variant="transparent"
            size="md"
            onClick={archiveForModel}
            className="flex items-center"
          >
            <Database size={18} className="mr-2" />
            Save Data for Model Training
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Earnings Today', value: `$${totalToday.toFixed(2)}` },
            { label: 'Food Waste Today', value: `$${totalWaste.toFixed(2)}` },
            { label: 'Cumulative Savings', value: `$${cumulative.toFixed(2)}` },
          ].map(({ label, value }) => (
            <motion.div
              key={label}
              className="p-6 bg-midnight-800 rounded-2xl neon-box border border-neon-magenta shadow-lg"
              whileHover={{ scale: 1.03 }}
            >
              <h4 className="text-lg font-semibold text-white">{label}</h4>
              <p className="text-2xl mt-2 text-neon-magenta">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Meal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {servings.map((s, idx) => (
            <motion.div
              key={idx}
              className="relative bg-midnight-900 border border-white/10 p-6 rounded-xl text-white"
              whileHover={{ scale: 1.02 }}
            >
              <button
                onClick={() => removeServing(s.name)}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600"
              >
                <Trash size={18} />
              </button>
              <h3 className="text-xl font-bold text-neon-magenta mb-2">{s.name}</h3>
              <p>Servings Made: {s.totalPlates}</p>
              <p>Wasted: {s.platesWasted}</p>
              <p>Ingredients Cost ($): {s.totalIngredientsCost.toFixed(2)}</p>
              <p>Loss ($): {(s.platesWasted * s.costPerPlate).toFixed(2)}</p>
              <p>Earning ($): {s.totalEarning.toFixed(2)}</p>
              {s.remark && <p className="italic text-sm mt-1">“{s.remark}”</p>}
            </motion.div>
          ))}
        </div>

        {/* Add Serving Form */}
        <div className="bg-midnight-800 p-8 rounded-xl border border-white/10 text-white">
          <h2 className="text-2xl font-semibold mb-4">Add Serving</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hybrid Dish Name Selection */}
            <div>
              <label className="block mb-1">Dish Name</label>
              <select
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-midnight-700 border border-white/10 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-neon-magenta"
              >
                <option value="">Select a Dish</option>
                {commonDishes.map(dish => (
                  <option key={dish} value={dish}>{dish}</option>
                ))}
              </select>
            </div>

            {/* Custom name input if "Other" selected */}
            {form.name === 'Other' && (
              <div>
                <label className="block mb-1">Custom Dish Name</label>
                <input
                  type="text"
                  name="customName"
                  value={form.customName}
                  onChange={handleChange}
                  className="w-full bg-midnight-700 border border-white/10 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-neon-magenta"
                />
              </div>
            )}

            {/* Rest of the fields */}
            {[
              { label: 'Cost Per Plate ($)', name: 'costPerPlate', type: 'number' },
              { label: 'Total Ingredients Cost ($)', name: 'totalIngredientsCost', type: 'number' },
              { label: 'Total Plates', name: 'totalPlates', type: 'number' },
              { label: 'Plates Wasted', name: 'platesWasted', type: 'number' },
              { label: 'Remark (Optional)', name: 'remark', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  className="w-full bg-midnight-700 border border-white/10 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-neon-magenta"
                />
              </div>
            ))}
          </div>
          <Button
            variant="magenta"
            size="md"
            onClick={addServing}
            className="mt-6 flex items-center"
          >
            <Plus size={18} className="mr-2" /> Add Serving
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default TodaysServing;
