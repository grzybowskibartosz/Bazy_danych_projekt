// /src/App.js
import React from 'react';
import PacjentList from './components/PacjentList';
import LekarzList from './components/LekarzList';
import GabinetList from './components/GabinetList';
import WizytaList from './components/WizytaList';
import Rejestracja from './components/Rejestracja';

//const App = () => {
//  return (
//    <div>
//      <h1>Moja Aplikacja Medyczna</h1>
//
//      <div>
//        <PacjentList />
//      </div>
//
//      <div>
//        <LekarzList />
//      </div>
//
//      <div>
//        <GabinetList />
//      </div>
//
//      <div>
//        <WizytaList />
//      </div>
//    </div>
//  );
//};
//
//export default App;

const App = () => {
  return (
    <div>
      <Rejestracja />
      {/* Tutaj dodaj inne komponenty lub widoki, jeśli są potrzebne */}
    </div>
  );
};

export default App;

