import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Pickup from './pages/Pickup';
import Reviews from './pages/Reviews';

function App() {
  return (
    <AudioProvider>
      <Router>
        <div className="min-h-screen bg-bakery-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pickup" element={<Pickup />} />
              <Route path="/reviews" element={<Reviews />} />
            </Routes>
          </main>
          
          {/* Custom Premium Footer */}
          <footer className="bg-bakery-900 text-bakery-200 border-t border-bakery-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center">
              <div className="mb-4 sm:mb-0">
                <span className="text-xl font-bold font-serif text-white tracking-wide">
                  🍞 Crust & Cream
                </span>
                <p className="text-xs text-bakery-400 mt-1">
                  Classic pairing bakery & healing lounge
                </p>
              </div>
              <div>
                <p className="text-xs text-bakery-400">
                  &copy; {new Date().getFullYear()} Crust & Cream. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AudioProvider>
  );
}

export default App;
