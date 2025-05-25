// src/pages/UpcomingEventPage.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ParticleBackground from '../components/layout/ParticleBackground';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

const UpcomingEventPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<Partial<EventItem>>({
    title: '',
    description: '',
    date: ''
  });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get<EventItem[]>('/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const addEvent = async () => {
    if (!form.title || !form.date) {
      alert('Title & Date are required');
      return;
    }
    const payload: EventItem = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description || '',
      date: form.date!
    };
    await axios.post('/api/events', payload);
    setForm({ title: '', description: '', date: '' });
    fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    await axios.delete(`/api/events/${id}`);
    fetchEvents();
  };

  return (
    <PageLayout title="Upcoming Events">
      {/* Page-specific leaves behind content */}
      <ParticleBackground className="absolute inset-0 z-0 opacity-50" />

      {/* Content wrapper */}
      <div className="relative z-10 space-y-8 p-6">
        {/* Add Event Form */}
        <Card className="p-6 bg-gray-100" glow={false}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Title *</label>
              <input
                name="title"
                value={form.title || ''}
                onChange={handleChange}
                placeholder="Event Title"
                className="w-full text-black placeholder-black border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                name="date"
                value={form.date || ''}
                onChange={handleChange}
                className="w-full text-black placeholder-black border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={form.description || ''}
                onChange={handleChange}
                placeholder="Event Description"
                className="w-full text-black placeholder-black border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>
          <div className="mt-4 text-right">
            <Button variant="solid" size="md" onClick={addEvent}>
              Add Event
            </Button>
          </div>
        </Card>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(evt => (
            <Card key={evt.id} className="p-6 relative bg-gray-100" glow={false}>
              <button
                onClick={() => deleteEvent(evt.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
              <h3 className="text-xl font-semibold text-green-600 mb-2">{evt.title}</h3>
              {evt.description && (
                <p className="text-gray-700 mb-2">{evt.description}</p>
              )}
              <p className="text-sm text-gray-600">
                Date: {new Date(evt.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default UpcomingEventPage;
