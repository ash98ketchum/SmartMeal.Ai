// src/components/layout/PageLayout.tsx
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import ParticleBackground from './ParticleBackground';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Full-screen falling leaves */}
      <ParticleBackground />

      {/* Navbar sits above the canvas */}
      <Navbar />

      {/* Main content above leaves */}
      <main className="flex-1 pt-24 pb-12 relative z-10 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          {title && (
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-green-600">
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>

      {/* Footer above leaves */}
      <footer className="py-4 border-t border-green-100 relative z-10 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} SmartMeal AI. All rights reserved.
            </div>
            <div className="text-sm text-gray-400">
              Version 1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
