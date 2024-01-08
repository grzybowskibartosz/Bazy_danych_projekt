import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Rejestracja from './Rejestracja';
import Login from './Login';
import PatientPanel from './PatientPanel';
import DoctorPanel from './DoctorPanel';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rejestracja" element={<Rejestracja />} />
        <Route path="/login" element={<Login />} />
        {/* Dodaj inne trasy, jeśli są dostępne */}
      </Routes>
    </Router>
  );
}

export default App;
