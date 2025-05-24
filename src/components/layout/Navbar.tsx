import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChefHat, Settings, History, Home, PlusCircle, HelpCircle, Calendar } from 'lucide-react';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { to: '/',           label: 'Dashboard',  icon: Home },
    { to: '/add-serving',label: 'Serving',    icon: PlusCircle },
    { to: '/events',     label: 'Events',     icon: Calendar },
    { to: '/history',    label: 'History',    icon: History },
    { to: '/settings',   label: 'Settings',   icon: Settings },
    { to: '/faq',        label: 'FAQ',        icon: HelpCircle },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-midnight-500/80 shadow-lg backdrop-blur-md'
          : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="p-2 rounded-full bg-neon-magenta/10 text-neon-magenta"
            >
              <ChefHat size={22} />
            </motion.div>
            <motion.h1
              className="text-xl font-bold neon-gradient-magenta"
              animate={{
                textShadow: [
                  '0 0 4px rgba(254, 83, 187, 0.3)',
                  '0 0 8px rgba(254, 83, 187, 0.5)',
                  '0 0 4px rgba(254, 83, 187, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              SmartMeal AI
            </motion.h1>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-6">
              {links.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `relative flex items-center text-sm font-medium transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <link.icon size={16} className="mr-1" />
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-glow-magenta"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile toggle */}
          <button className="block md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-midnight-900/90 z-40 pt-20 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4">
              <ul className="flex flex-col space-y-4">
                {links.map((link, idx) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center py-3 px-4 rounded-lg text-lg ${
                          isActive
                            ? 'bg-neon-magenta/10 text-neon-magenta'
                            : 'text-gray-300 hover:bg-white/5'
                        }`
                      }
                      onClick={toggleMenu}
                    >
                      <link.icon size={20} className="mr-3" />
                      {link.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
