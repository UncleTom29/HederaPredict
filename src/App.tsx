import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
// import Pricing from './components/Pricing';
import Footer from './components/Footer';
import DApp from './pages/DApp';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <HowItWorks />
              <Benefits />
              <Testimonials />
              {/* <Pricing /> */}
            </>
          } />
          <Route path="/dapp" element={<DApp />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;