import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Library from './components/Library';
import Members from './components/Members';
import Debates from './components/Debates';
import Footer from './components/Footer';

function App() {
  const [activePage, setActivePage] = useState('inicio');
  const [darkMode, setDarkMode] = useState(false);

  // Efecto para aplicar el tema oscuro en el body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'inicio':
        return (
          <>
            <Hero />
            <Library />
          </>
        );
      case 'integrantes':
        return <Members />;
      case 'debates':
        return <Debates />;
      default:
        return (
          <>
            <Hero />
            <Library />
          </>
        );
    }
  };

  return (
    <>
      <Navbar 
        setPage={setActivePage} 
        activePage={activePage} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      <main className="layout-container">
        {renderContent()}
      </main>
      <Footer />
    </>
  );
}

export default App;
