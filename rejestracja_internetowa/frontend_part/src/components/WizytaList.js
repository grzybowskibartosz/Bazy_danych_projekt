// /src/components/WizytaList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WizytaList = () => {
  const [wizyty, setWizyty] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/wizyty/');
        setWizyty(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Lista Wizyt</h2>
      <ul>
        {wizyty.map(wizyta => (
          <li key={wizyta.id}>{wizyta.data_i_godzina} - {wizyta.lekarz.imie} {wizyta.lekarz.nazwisko}</li>
        ))}
      </ul>
    </div>
  );
};

export default WizytaList;
