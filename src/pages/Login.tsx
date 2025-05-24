import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1500);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8" glowColor="magenta">
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="p-3 rounded-full bg-neon-magenta/10 text-neon-magenta"
            >
              <ChefHat size={32} />
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-2xl font-bold text-center mb-6 neon-gradient-magenta"
            animate={{ 
              textShadow: ['0 0 4px rgba(254, 83, 187, 0.3)', '0 0 8px rgba(254, 83, 187, 0.5)', '0 0 4px rgba(254, 83, 187, 0.3)']
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            SmartMeal AI
          </motion.h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-midnight-600 border border-white/10 text-white rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-neon-magenta focus:border-neon-magenta"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <div className="mb-2 flex justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <a href="#" className="text-xs text-neon-cyan hover:text-neon-cyan/80">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-midnight-600 border border-white/10 text-white rounded-lg block w-full pl-10 pr-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-neon-magenta focus:border-neon-magenta"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              variant="magenta"
              className="w-full py-2.5"
              isLoading={loading}
            >
              Sign in
            </Button>
            
            <div className="mt-4 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="text-neon-cyan hover:text-neon-cyan/80 font-medium">
                Sign up
              </a>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;