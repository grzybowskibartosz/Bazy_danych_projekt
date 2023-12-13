// /src/components/LekarzList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LekarzList = () => {
  const [lekarze, setLekarze] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/lekarze/')
      .then(response => setLekarze(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>Lista Lekarzy</h2>
      <ul>
        {lekarze.map(lekarz => (
          <li key={lekarz.id}>{lekarz.imie} {lekarz.nazwisko} - {lekarz.specjalizacja}</li>
        ))}
      </ul>
    </div>
  );
};

export default LekarzList;
