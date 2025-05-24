import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

import Dashboard         from './pages/Dashboard';
import History           from './pages/History';
import Settings          from './pages/Settings';
import FAQ               from './pages/FAQ';
import TodaysServing     from './pages/TodaysServing';
import UpcomingEventPage    from './pages/UpcomingEventPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/add-serving"  element={<TodaysServing />} />
          <Route path="/history"      element={<History />} />
          <Route path="/settings"     element={<Settings />} />
          <Route path="/faq"          element={<FAQ />} />
          <Route path="/events"       element={<UpcomingEventPage />} />
          <Route path="*"             element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
