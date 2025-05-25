// src/pages/Settings.tsx
import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bell, BarChart3 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ParticleBackground from '../components/layout/ParticleBackground';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  index: number;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, icon, children, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <Card className="p-6 bg-gray-100" glow={false}>
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  </motion.div>
);

const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: () => void;
  label: string;
}> = ({ enabled, onChange, label }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        enabled ? 'bg-green-600' : 'bg-gray-300'
      }`}
      onClick={onChange}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const Settings: React.FC = () => {
  const [notifications, setNotifications] = React.useState({
    predictionsCompleted: true,
    weeklyReports: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  const [modelSettings, setModelSettings] = React.useState({
    autoUpdateModel: true,
    highPrecisionMode: false,
    saveIngredientData: true,
  });

  const [isRecalibrating, setIsRecalibrating] = React.useState(false);

  const toggleNotification = (key: keyof typeof notifications) =>
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleModelSetting = (key: keyof typeof modelSettings) =>
    setModelSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const recalibrateModel = async () => {
    if (!window.confirm('Run model recalibration now?')) return;
    setIsRecalibrating(true);
    try {
      const res = await axios.post('/api/recalibrate');
      alert(res.data.message || 'Model recalibrated successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Recalibration failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsRecalibrating(false);
    }
  };

  return (
    <PageLayout title="Settings">
      <ParticleBackground className="absolute inset-0 z-0 opacity-50" />
      <div className="relative z-10 space-y-6 p-6">
        {/* Notifications Section */}
        <SettingSection title="Notifications" icon={<Bell size={20} />} index={0}>
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

        {/* AI Model Section */}
        <SettingSection title="AI Model" icon={<BarChart3 size={20} />} index={1}>
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
