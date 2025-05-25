// src/pages/TodaysServing.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PageLayout from '../components/layout/PageLayout';
import ParticleBackground from '../components/layout/ParticleBackground';
import { Plus, Trash, Database } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

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
  // ... other dishes ...
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
    } catch {
      setServings([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addServing = async () => {
    const costPerPlate = parseFloat(form.costPerPlate);
    const totalIngredientsCost = parseFloat(form.totalIngredientsCost);
    const totalPlates = parseInt(form.totalPlates, 10);
    const platesWasted = parseInt(form.platesWasted, 10);

    if (
      isNaN(costPerPlate) ||
      isNaN(totalIngredientsCost) ||
      isNaN(totalPlates) ||
      isNaN(platesWasted) ||
      totalPlates === 0
    ) {
      alert("Please enter valid numbers and ensure total plates > 0.");
      return;
    }

    const ingredientCostPerPlate = totalIngredientsCost / totalPlates;
    const netPlates = totalPlates - platesWasted;
    const totalEarning = (costPerPlate - ingredientCostPerPlate) * netPlates;
    const servingName = form.name === "Other" ? form.customName : form.name;

    // define newServing before use
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
      alert("Today's data archived successfully!");
    } catch {
      alert("Failed to archive data.");
    }
  };

  const totalToday = servings.reduce((sum, s) => sum + s.totalEarning, 0);
  const totalWaste = servings.reduce((sum, s) => sum + s.platesWasted * s.costPerPlate, 0);
  const cumulative = totalToday - totalWaste;

  return (
    <PageLayout title="Today's Serving">
      <ParticleBackground className="absolute inset-0 z-0 opacity-50" />
      <div className="relative z-10 space-y-8 p-6">

        {/* Archive */}
        <div className="flex justify-end">
          <Button variant="outline" size="md" onClick={archiveForModel}>
            <Database size={18} className="mr-2" /> Save Data for Model Training
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Earnings', value: `$${totalToday.toFixed(2)}` },
            { label: 'Food Waste', value: `$${totalWaste.toFixed(2)}` },
            { label: 'Net Savings', value: `$${cumulative.toFixed(2)}` },
          ].map(item => (
            <Card key={item.label} className="p-6 text-center bg-gray-100" glow={false}>
              <h4 className="text-lg font-medium text-gray-700">{item.label}</h4>
              <p className="text-2xl font-bold text-green-600 mt-2">{item.value}</p>
            </Card>
          ))}
        </div>

        {/* Serving List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servings.map((s, idx) => (
            <Card key={idx} className="p-6 relative bg-gray-100" glow={false}>
              <button
                onClick={() => removeServing(s.name)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash size={18} />
              </button>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{s.name}</h3>
              <p className="text-gray-600">Made: {s.totalPlates}</p>
              <p className="text-gray-600">Wasted: {s.platesWasted}</p>
              <p className="text-gray-600">Cost: ${s.totalIngredientsCost.toFixed(2)}</p>
              <p className="text-gray-600">Earned: ${s.totalEarning.toFixed(2)}</p>
              {s.remark && <p className="italic text-sm text-gray-500 mt-2">“{s.remark}”</p>}
            </Card>
          ))}
        </div>

        {/* Add Serving Form */}
        <Card className="p-8 bg-gray-100" glow={false}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Serving</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Dish Name</label>
              <select
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
              >
                <option value="">Select a Dish</option>
                {commonDishes.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {form.name === 'Other' && (
              <div>
                <label className="block text-gray-700 mb-1">Custom Dish Name</label>
                <input
                  type="text"
                  name="customName"
                  value={form.customName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
                />
              </div>
            )}

            {[
              { label: 'Cost Per Plate ($)', name: 'costPerPlate', type: 'number' },
              { label: 'Total Ingredients Cost ($)', name: 'totalIngredientsCost', type: 'number' },
              { label: 'Total Plates', name: 'totalPlates', type: 'number' },
              { label: 'Plates Wasted', name: 'platesWasted', type: 'number' },
              { label: 'Remark', name: 'remark', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
                />
              </div>
            ))}
          </div>

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
