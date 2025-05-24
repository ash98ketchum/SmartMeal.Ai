import React from "react";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
// import PageLayout from '../components/layout/PageLayout';
// import Card from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import { mockPredictions } from '../data/mockData';

const faqs = [
  {
    question: "What is SmartMeal AI?",
    answer:
      "SmartMeal AI helps you track food production, waste, and earnings per serving in real time, with insights for smarter kitchen decisions."
  },
  {
    question: "How does 'Save Data for Model Training' work?",
    answer:
      "It archives today's serving data for backend model training and resets the current view only when the date changes or the entry is manually deleted."
  },
  {
    question: "Will I lose my data on page refresh?",
    answer:
      "No. All serving entries are persistently stored and reloaded from the server on page load via the 'todaysserving.json' file."
  },
  {
    question: "What happens when I delete a card?",
    answer:
      "Deleting a card removes that specific serving record from today's data permanently."
  },
  {
    question: "How do I add a serving?",
    answer:
      "Fill out the Add Serving form below the cards with the meal name, cost, quantity, and waste. Then click 'Add Serving'."
  }
];

const FAQ: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-white">
      <div className="mb-10 flex items-center space-x-3">
        <HelpCircle className="text-neon-magenta" size={28} />
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="p-6 bg-midnight-800 border border-white/10 rounded-2xl shadow-md"
          >
            <h3 className="text-xl font-semibold text-neon-magenta mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
