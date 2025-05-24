import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import ParticleBackground from './ParticleBackground';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ParticleBackground />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          {title && (
            <h1 className="text-2xl md:text-3xl font-bold mb-6 neon-gradient-cyan">{title}</h1>
          )}
          {children}
        </div>
      </main>
      
      <footer className="py-4 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} SmartMeal AI. All rights reserved.
            </div>
            <div className="text-sm text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;