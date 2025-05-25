// src/pages/FAQ.tsx
import React from "react";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import PageLayout from '../components/layout/PageLayout';
import ParticleBackground from '../components/layout/ParticleBackground';

const faqs = [
  { question: "What is SmartMeal AI?", answer: "SmartMeal AI helps you track food production, waste, and earnings per serving in real time, with insights for smarter kitchen decisions." },
  { question: "How does 'Save Data for Model Training' work?", answer: "It archives today's serving data for backend model training and resets the current view only when the date changes or the entry is manually deleted." },
  { question: "Will I lose my data on page refresh?", answer: "No. All serving entries are persistently stored and reloaded from the server on page load via the 'todaysserving.json' file." },
  { question: "What happens when I delete a card?", answer: "Deleting a card removes that specific serving record from today's data permanently." },
  { question: "How do I add a serving?", answer: "Fill out the Add Serving form below the cards with the meal name, cost, quantity, and waste. Then click 'Add Serving'." },
  { question: "What does 'Save Data for Model Training' do?", answer: "It archives today’s serving data into a dedicated JSON file for machine‐learning analysis—without removing your live entries. They clear only at midnight or when manually reset." },
  { question: "Where can I manage upcoming events?", answer: "Navigate to the Events page via the navbar. There you can add, view, and delete future events on a monthly schedule. These events also surface on the Dashboard." },
  { question: "How are upcoming events displayed on the Dashboard?", answer: "The Dashboard shows the next four upcoming events by date, each with a live countdown. Events persist until you manually delete them or their date passes." },
  { question: "Will my data persist after refreshing the page?", answer: "Yes. All serving entries and events are stored server‐side in JSON files (`todaysserving.json`, `events.json`). On reload, the app fetches and restores them." },
  { question: "Can I track historical trends over time?", answer: "Currently, you can archive daily data for ML training. Future releases will include graphical trend charts and historical analytics directly in the UI." },
];

const FAQ: React.FC = () => (
  <PageLayout title="FAQ">
    {/* Page-specific leaves behind content */}
    <ParticleBackground className="absolute inset-0 z-0 opacity-50" />

    {/* Content wrapper */}
    <div className="relative z-10 container mx-auto px-6 py-12 bg-white rounded-lg shadow-lg">
      <div className="mb-8 flex items-center space-x-3">
        <HelpCircle className="text-green-600" size={28} />
        <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm"
          >
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </PageLayout>
);

export default FAQ;
