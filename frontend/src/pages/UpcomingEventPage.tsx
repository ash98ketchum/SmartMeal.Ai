// src/pages/UpcomingEventPage.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';

interface EventItem {
  id: string;           // uuid or timestamp
  title: string;
  description: string;
  date: string;         // ISO string
}

const UpcomingEventPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState<Partial<EventItem>>({
    title: '',
    description: '',
    date: ''
  });

  // fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await axios.get<EventItem[]>('/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // add new event
  const addEvent = async () => {
    if (!form.title || !form.date) {
      return alert('Title & Date are required');
    }
    const payload = {
      id: Date.now().toString(),
      title: form.title!,
      description: form.description || '',
      date: form.date!
    };
    await axios.post('/api/events', payload);
    setForm({ title: '', description: '', date: '' });
    fetchEvents();
  };

  // delete event
  const deleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    await axios.delete(`/api/events/${id}`);
    fetchEvents();
  };

  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-neon-magenta mb-6">Manage Upcoming Events</h1>

      {/* Add Event Form */}
      <div className="bg-midnight-800 p-6 rounded-2xl border border-white/10 mb-10">
        <h2 className="text-2xl font-semibold mb-4">Add New Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Title *</label>
            <input
              name="title"
              value={form.title || ''}
              onChange={handleChange}
              className="w-full bg-midnight-700 border border-white/10 p-2 rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={form.date || ''}
              onChange={handleChange}
              className="w-full bg-midnight-700 border border-white/10 p-2 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description || ''}
              onChange={handleChange}
              className="w-full bg-midnight-700 border border-white/10 p-2 rounded-md"
            />
          </div>
        </div>
        <Button variant="magenta" className="mt-4" onClick={addEvent}>
          Add Event
        </Button>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(evt => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-midnight-900 border border-white/10 p-6 rounded-2xl"
          >
            <button
              onClick={() => deleteEvent(evt.id)}
              className="absolute top-3 right-3 text-red-400 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
            <h3 className="text-xl font-semibold text-neon-magenta">{evt.title}</h3>
            <p className="mt-1 text-gray-300">{evt.description}</p>
            <p className="mt-3 text-sm">
              <span className="font-medium">Date:</span>{' '}
              {new Date(evt.date).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventPage;
