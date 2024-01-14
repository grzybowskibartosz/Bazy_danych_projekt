import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import HomePage from './HomePage';
import Rejestracja from './Rejestracja';
import Login from './Login';
import NasiLekarze from './NasiLekarze';
import DostepneTerminy from './DostepneTerminy';
import MojeWizyty from './MojeWizyty';
import Rezerwacje from './Rezerwacje';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Rejestracja" element={<Rejestracja />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/nasi-lekarze" element={<NasiLekarze />} />
        <Route path="/dostepne-terminy/:lekarzId" element={<DostepneTerminy />} />
        <Route path="/api/moje-wizyty" element={<MojeWizyty />} />
        <Route path="/rezerwacje/:lekarzId/:rok/:miesiac/:dzien/:godzina/:minuta" element={<Rezerwacje />} />

      </Routes>
    </Router>
  );
}

export default App;
