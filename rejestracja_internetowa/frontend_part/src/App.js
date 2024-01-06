import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import HomePage from './HomePage';
import Rejestracja from './Rejestracja';
import NasiLekarze from './NasiLekarze';
import DostepneTerminy from './DostepneTerminy';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rejestracja" element={<Rejestracja />} />
        <Route path="/nasi-lekarze" element={<NasiLekarze />} />
        <Route path="/dostepne-terminy/:lekarzId" element={<DostepneTerminy />} />
      </Routes>
    </Router>
  );
}

export default App;
