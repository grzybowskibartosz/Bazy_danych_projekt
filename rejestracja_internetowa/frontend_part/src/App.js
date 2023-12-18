import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Rejestracja from './Rejestracja';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rejestracja" element={<Rejestracja />} />
        {/* Dodaj inne trasy, jeśli są dostępne */}
      </Routes>
    </Router>
  );
}

export default App;
