// src/pages/Settings.tsx
import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bell, BarChart3 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ParticleBackground from '../components/layout/ParticleBackground';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Props interface for SettingSection component
interface SettingSectionProps {
  title: string;          // Section title text
  icon: React.ReactNode;  // Icon element displayed next to title
  children: React.ReactNode; // Section content components (usually toggles)
  index: number;          // Used to stagger animation delay
}

// SettingSection component: wraps a settings section with animated card UI
const SettingSection: React.FC<SettingSectionProps> = ({ title, icon, children, index }) => (
  <motion.div
    // Animate fade and slide up on mount with stagger based on index
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    {/* Card container with padding and light gray background */}
    <Card className="p-6 bg-gray-100" glow={false}>
      {/* Header with icon and title */}
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {/* Content section with vertical spacing */}
      <div className="space-y-4">{children}</div>
    </Card>
  </motion.div>
);

// ToggleSwitch component props interface
interface ToggleSwitchProps {
  enabled: boolean;       // Whether the toggle is ON
  onChange: () => void;   // Function to toggle the value
  label: string;          // Label text displayed next to toggle
}

// ToggleSwitch component: a custom styled toggle button
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => (
  <div className="flex items-center justify-between">
    {/* Label on the left */}
    <span className="text-sm text-gray-700">{label}</span>

    {/* Toggle button on the right */}
    <button
      type="button"
      // Background color changes based on enabled state
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        enabled ? 'bg-green-600' : 'bg-gray-300'
      }`}
      onClick={onChange}  // Toggle state on click
    >
      {/* Circle inside toggle switches position based on enabled */}
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// Main Settings page component
const Settings: React.FC = () => {
  // Notification settings state with default values
  const [notifications, setNotifications] = React.useState({
    predictionsCompleted: true,
    weeklyReports: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  // AI Model related settings state with defaults
  const [modelSettings, setModelSettings] = React.useState({
    autoUpdateModel: true,
    highPrecisionMode: false,
    saveIngredientData: true,
  });

  // State to track whether recalibration API call is in progress
  const [isRecalibrating, setIsRecalibrating] = React.useState(false);

  // Handler to toggle a notification setting by key
  const toggleNotification = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  // Handler to toggle a model setting by key
  const toggleModelSetting = (key: keyof typeof modelSettings) =>
    setModelSettings(prev => ({ ...prev, [key]: !prev[key] }));

  // Async function to trigger model recalibration API call
  const recalibrateModel = async () => {
    // Confirm action with user before proceeding
    if (!window.confirm('Run model recalibration now?')) return;

    setIsRecalibrating(true); // Show loading state on button

    try {
      // Make POST request to recalibrate endpoint
      const res = await axios.post('/api/recalibrate');

      // Notify success with response message or default
      alert(res.data.message || 'Model recalibrated successfully!');
    } catch (err: any) {
      // Log error and show alert with error details
      console.error(err);
      alert('Recalibration failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsRecalibrating(false); // Remove loading state
    }
  };

  return (
    <PageLayout title="Settings">
      {/* Particle background effect with opacity */}
      <ParticleBackground className="absolute inset-0 z-0 opacity-50" />

      {/* Main container with spacing and padding */}
      <div className="relative z-10 space-y-6 p-6">
        {/* Notifications settings section */}
        <SettingSection title="Notifications" icon={<Bell size={20} />} index={0}>
          {/* Each toggle controls a notification option */}
          <ToggleSwitch
            enabled={notifications.predictionsCompleted}
            onChange={() => toggleNotification('predictionsCompleted')}
            label="Notify when predictions are completed"
          />
          <ToggleSwitch
            enabled={notifications.weeklyReports}
            onChange={() => toggleNotification('weeklyReports')}
            label="Weekly summary reports"
          />
          <ToggleSwitch
            enabled={notifications.systemUpdates}
            onChange={() => toggleNotification('systemUpdates')}
            label="System updates and maintenance"
          />
          <ToggleSwitch
            enabled={notifications.marketingEmails}
            onChange={() => toggleNotification('marketingEmails')}
            label="Marketing emails and offers"
          />
        </SettingSection>

        {/* AI Model configuration section */}
        <SettingSection title="AI Model" icon={<BarChart3 size={20} />} index={1}>
          {/* Model setting toggles */}
          <ToggleSwitch
            enabled={modelSettings.autoUpdateModel}
            onChange={() => toggleModelSetting('autoUpdateModel')}
            label="Automatically update AI model on new versions"
          />
          <ToggleSwitch
            enabled={modelSettings.highPrecisionMode}
            onChange={() => toggleModelSetting('highPrecisionMode')}
            label="High precision mode (slower processing)"
          />
          <ToggleSwitch
            enabled={modelSettings.saveIngredientData}
            onChange={() => toggleModelSetting('saveIngredientData')}
            label="Save ingredient data for future predictions"
          />
          {/* Button to trigger model recalibration */}
          <div className="pt-2">
            <Button
              variant="solid"
              size="md"
              onClick={recalibrateModel}
              isLoading={isRecalibrating}
            >
              Recalibrate Model
            </Button>
          </div>
        </SettingSection>
      </div>
    </PageLayout>
  );
};

export default Settings;
