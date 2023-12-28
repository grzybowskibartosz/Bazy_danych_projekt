// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Rejestracja from './Rejestracja';
import NasiLekarze from './NasiLekarze';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rejestracja" element={<Rejestracja />} />
        <Route path="/nasi-lekarze" element={<NasiLekarze />} />
      </Routes>
    </Router>
  );
}

export default App;
