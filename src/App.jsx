import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Library from './components/Library';
import Members from './components/Members';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
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
    </BrowserRouter>
  );
}

export default App;
