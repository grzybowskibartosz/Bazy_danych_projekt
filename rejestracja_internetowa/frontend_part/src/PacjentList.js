// PacjentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PacjentList = () => {
  const [pacjenci, setPacjenci] = useState([]);



  useEffect(() => {
    const fetchPacjenci = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pacjenci/');
        setPacjenci(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania danych pacjentów', error);
      }
    };

    fetchPacjenci();
  }, []);

  return (
    <div>
      <h2>Lista Pacjentów</h2>
      <ul>
        {pacjenci.map((pacjent) => (
          <li key={pacjent.id}>
            <strong>{pacjent.imie} {pacjent.nazwisko}</strong> - Pesel: {pacjent.pesel}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PacjentList;