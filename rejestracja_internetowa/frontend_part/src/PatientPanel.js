import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const PatientPanel = ({ userData }) => {
  const [wizyty, setWizyty] = useState([]);

  useEffect(() => {
    const fetchWizyty = async () => {
      try {
        const response = await axios.get('/api/moje-wizyty/');
        setWizyty(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania wizyt pacjenta', error);
      }
    };

    fetchWizyty();
  }, [userData]);

  return (
    <div>
      <Typography variant="h5">Panel Pacjenta</Typography>
      <p>Imię: {userData.imie}</p>
      <p>Nazwisko: {userData.nazwisko}</p>
      <p>Data urodzenia: {userData.data_urodzenia}</p>
      <p>Adres: {userData.adres}</p>
      <p>Pesel: {userData.pesel}</p>
      <p>Inne informacje: {userData.inne_informacje}</p>

      <Typography variant="h6">Moje wizyty:</Typography>
      <ul>
        {wizyty.map((wizyta) => (
          <li key={wizyta.id}>{wizyta.data_i_godzina}: {wizyta.opis}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientPanel;
