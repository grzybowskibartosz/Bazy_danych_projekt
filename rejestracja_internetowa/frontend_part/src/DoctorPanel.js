// DoctorPanel.js

import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Calendar from 'react-calendar';
import { useParams } from 'react-router-dom';

import logo from './logo.png';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const DoctorPanel = ({ userData }) => {
  const [wizyty, setWizyty] = useState([]);

  useEffect(() => {
    // Pobierz dane o wizytach lekarza z backendu
    const fetchWizyty = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/wizyty/${userData.id}/lekarz/`);
        setWizyty(response.data);
      } catch (error) {
        console.error('Błąd pobierania danych o wizytach lekarza', error);
      }
    };

    fetchWizyty();
  }, [userData.id]);

  return (
    <div>
      <Typography variant="h5">Panel Lekarza</Typography>
      <p>Imię: {userData.imie}</p>
      <p>Nazwisko: {userData.nazwisko}</p>
      <p>Specjalizacja: {userData.specjalizacja}</p>
      {/* Dodaj więcej pól w zależności od danych lekarza */}

      {/* Wyświetl dane o wizytach lekarza */}
      <div>
        <Typography variant="h6">Wizyty lekarza:</Typography>
        <ul>
          {wizyty.map((wizyta) => (
            <li key={wizyta.id}>
              Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorPanel;
