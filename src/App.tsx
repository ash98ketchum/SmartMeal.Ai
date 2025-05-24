// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

import Dashboard     from './pages/Dashboard';
import History       from './pages/History';
import Settings      from './pages/Settings';
import Login         from './pages/Login';
import TodaysServing from './pages/TodaysServing';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

function AppRoutes() {
  const { pathname } = useLocation();
  const hideNavOn = ['/login'];
  const showNavbar = !hideNavOn.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}

     {/* push all routes down by the navbar’s height */}
     <div className={showNavbar ? 'pt-20' : ''}>
        <Routes>
          <Route path="/login"        element={<Login />} />
          <Route path="/"             element={<Dashboard />} />
          <Route path="/history"      element={<History />} />
          <Route path="/add-serving"  element={<TodaysServing />} />
          <Route path="/settings"     element={<Settings />} />
          <Route path="*"             element={<Dashboard />} />
        </Routes>
     </div>
    </>
  );
}
