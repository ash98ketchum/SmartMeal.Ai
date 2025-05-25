// Import necessary libraries and components
import React, { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios'; // For making HTTP requests
import { motion } from 'framer-motion'; // (Optional) animation library, imported but not used here
import { Trash2 } from 'lucide-react'; // Trash icon for delete button
import PageLayout from '../components/layout/PageLayout'; // Custom layout wrapper
import ParticleBackground from '../components/layout/ParticleBackground'; // Decorative background effect
import Button from '../components/ui/Button'; // Reusable button component
import Card from '../components/ui/Card'; // Reusable card container

// Define the structure of an event
interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

// Main component for displaying and managing upcoming events
const UpcomingEventPage: React.FC = () => {
  // Store all events
  const [events, setEvents] = useState<EventItem[]>([]);

  // Form state for adding a new event
  const [form, setForm] = useState<Partial<EventItem>>({
    title: '',
    description: '',
    date: ''
  });

  // Fetch all events once when component mounts
  useEffect(() => { fetchEvents(); }, []);

  // Fetch existing events from the backend API
  const fetchEvents = async () => {
    try {
      const res = await axios.get<EventItem[]>('/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events', err);
    }
  };

  // Handle input field changes and update the form state
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Add a new event to the server and refresh list
  const addEvent = async () => {
    if (!form.title || !form.date) {
      alert('Title & Date are required');
      return;
    }

    // Create new event object with unique ID
    const payload: EventItem = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description || '',
      date: form.date!
    };

    // Send new event to the backend
    await axios.post('/api/events', payload);

    // Reset the form and reload the event list
    setForm({ title: '', description: '', date: '' });
    fetchEvents();
  };

  // Delete an event by its ID after user confirmation
  const deleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    await axios.delete(`/api/events/${id}`);
    fetchEvents();
  };

  return (
    <PageLayout title="Upcoming Events">
      {/* Decorative particle animation in the background */}
      <ParticleBackground className="absolute inset-0 z-0 opacity-50" />

      {/* Main content wrapper */}
      <div className="relative z-10 space-y-8 p-6">
        
        {/* Form section for adding new events */}
        <Card className="p-6 bg-gray-100" glow={false}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Event</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Title Input */}
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

            {/* Event Date Input */}
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

            {/* Event Description Input */}
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

          {/* Submit Button */}
          <div className="mt-4 text-right">
            <Button variant="solid" size="md" onClick={addEvent}>
              Add Event
            </Button>
          </div>
        </Card>

        {/* Event Display Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(evt => (
            <Card key={evt.id} className="p-6 relative bg-gray-100" glow={false}>
              
              {/* Delete Button */}
              <button
                onClick={() => deleteEvent(evt.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>

              {/* Event Title */}
              <h3 className="text-xl font-semibold text-green-600 mb-2">{evt.title}</h3>

              {/* Optional Description */}
              {evt.description && (
                <p className="text-gray-700 mb-2">{evt.description}</p>
              )}

              {/* Event Date */}
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
