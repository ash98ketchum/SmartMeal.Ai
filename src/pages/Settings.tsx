
import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bell, User, BarChart3 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
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
    <Card className="p-6" glowColor={index % 2 === 0 ? 'cyan' : 'magenta'}>
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg mr-3 ${
          index % 2 === 0 ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-magenta/10 text-neon-magenta'
        }`}>
          {icon}
        </div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  </motion.div>
);

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void; label: string }> = ({
  enabled, onChange, label
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-300">{label}</span>
    <button
      type="button"
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        ${enabled ? 'bg-neon-cyan' : 'bg-midnight-400'}
        transition-colors duration-300
      `}
      onClick={onChange}
    >
      <span
        className={`
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
        `}
      />
    </button>
  </div>
);

const Settings: React.FC = () => {
  const [notifications, setNotifications] = React.useState({
    predictionsCompleted: true,
    weeklyReports: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const [modelSettings, setModelSettings] = React.useState({
    autoUpdateModel: true,
    highPrecisionMode: false,
    saveIngredientData: true
  });

  const [isRecalibrating, setIsRecalibrating] = React.useState(false);

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleModelSettingChange = (key: keyof typeof modelSettings) => {
    setModelSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
      <div className="space-y-6">
        {/* Notifications Section */}
        <SettingSection title="Notifications" icon={<Bell size={20} />} index={0}>
          <ToggleSwitch
            enabled={notifications.predictionsCompleted}
            onChange={() => handleNotificationChange('predictionsCompleted')}
            label="Notify when predictions are completed"
          />
          <ToggleSwitch
            enabled={notifications.weeklyReports}
            onChange={() => handleNotificationChange('weeklyReports')}
            label="Weekly summary reports"
          />
          <ToggleSwitch
            enabled={notifications.systemUpdates}
            onChange={() => handleNotificationChange('systemUpdates')}
            label="System updates and maintenance"
          />
          <ToggleSwitch
            enabled={notifications.marketingEmails}
            onChange={() => handleNotificationChange('marketingEmails')}
            label="Marketing emails and offers"
          />
        </SettingSection>

        {/* AI Model Section */}
        <SettingSection title="AI Model" icon={<BarChart3 size={20} />} index={1}>
          <ToggleSwitch
            enabled={modelSettings.autoUpdateModel}
            onChange={() => handleModelSettingChange('autoUpdateModel')}
            label="Automatically update AI model on new versions"
          />
          <ToggleSwitch
            enabled={modelSettings.highPrecisionMode}
            onChange={() => handleModelSettingChange('highPrecisionMode')}
            label="High precision mode (slower processing)"
          />
          <ToggleSwitch
            enabled={modelSettings.saveIngredientData}
            onChange={() => handleModelSettingChange('saveIngredientData')}
            label="Save ingredient data for future predictions"
          />
          <div className="pt-2">
            <Button
              variant="cyan"
              onClick={recalibrateModel}
              isLoading={isRecalibrating}
            >
              Recalibrate Model
            </Button>
          </div>
        </SettingSection>

        {/* Account Section */}
        <SettingSection title="Account" icon={<User size={20} />} index={2}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-white/10">
            <img
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">Alex Morgan</h3>
              <p className="text-sm text-gray-400">alex.morgan@example.com</p>
              <p className="text-xs text-neon-cyan mt-1">Premium Plan</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="transparent">Edit Profile</Button>
            <Button variant="transparent">Change Password</Button>
          </div>
        </SettingSection>
      </div>
    </PageLayout>
  );
};

export default Settings;
