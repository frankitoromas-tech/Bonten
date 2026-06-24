import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import Hero from './components/Hero';
import Library from './components/Library';
import Members from './components/Members';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="layout-container">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Library />
            </>
          } />
          <Route path="/integrantes" element={<Members />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
