import React, { useEffect, useState } from 'react';
import api from './api';

const MojeWizyty = () => {
  const [mojeWizyty, setMojeWizyty] = useState([]);

  useEffect(() => {
    const fetchMojeWizyty = async () => {
      try {
        const response = await api.get('/moje-wizyty/');
        setMojeWizyty(response.data);
      } catch (error) {
        console.error('Błąd pobierania wizyt:', error);
      }
    };

    fetchMojeWizyty();
  }, []);

  return (
    <div>
      <h1>Moje Wizyty</h1>
      {/* Dodaj kod do renderowania listy wizyt */}
    </div>
  );
};

export default MojeWizyty;
