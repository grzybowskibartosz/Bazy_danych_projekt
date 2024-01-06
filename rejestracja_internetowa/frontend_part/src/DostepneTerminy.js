import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import logo from './logo.png';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';  // Zmiana importu
import { useHistory } from 'react-router-dom';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#26a197',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'flex start',
});

const StyledButtonsContainer = styled('div')({
  display: 'flex',
  gap: '10px',
  marginLeft: 'auto',
});

const StyledLogo = styled('img')({
  height: '70px',
  margin: '10px 0',
});

const DostepneTerminy = () => {
  const { lekarzId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dostepneTerminy, setDostepneTerminy] = useState([]);

  useEffect(() => {
    if (lekarzId) {
      const rok = selectedDate.getFullYear();
      const miesiac = selectedDate.getMonth() + 1;
      const dzien = selectedDate.getDate();

      axios.get(`http://localhost:8000/api/zajete-terminy/${lekarzId}/${rok}/${miesiac}/${dzien}/`)
        .then(response => {
          const zajeteTerminy = response.data.zajete_terminy.map(date => new Date(date));
          const wszystkieTerminy = generujWszystkieTerminy(selectedDate);
          const dostepneTerminy = wszystkieTerminy.filter(termin => !czyTerminJestZajety(termin, zajeteTerminy));

          setDostepneTerminy(dostepneTerminy);
        })
        .catch(error => console.error('Błąd pobierania dostępnych terminów:', error));
    }
  }, [lekarzId, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const generujWszystkieTerminy = (selectedDate) => {
    const terminy = [];
    const startHour = 8;
    const endHour = 16;
    const intervalMinutes = 20;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const termin = new Date(selectedDate);
        termin.setHours(hour);
        termin.setMinutes(minute);
        terminy.push(termin);
      }
    }

    return terminy;
  };

  const czyTerminJestZajety = (termin, zajeteTerminy) => {
    return zajeteTerminy.some(zajetyTermin => zajetyTermin.getTime() === termin.getTime());
  };

 return (
    <div>
      <StyledAppBar position="static">
        <StyledToolbar>
          <StyledLogo src={logo} alt="PolwroMED Logo" />
          <Typography variant="h6">PolwroMED</Typography>
          <StyledButtonsContainer>
            <Button color="inherit" component={Link} to="/">
              Strona Główna
            </Button>
            <Button color="inherit" component={Link} to="/logowanie">
              Logowanie
            </Button>
            <Button color="inherit" component={Link} to="/rejestracja">
              Rejestracja
            </Button>
            <Button color="inherit" component={Link} to="/nasi-lekarze">
              Nasi lekarze
            </Button>
          </StyledButtonsContainer>
        </StyledToolbar>
      </StyledAppBar>
      <h1>Dostępne terminy</h1>
      <Calendar onChange={handleDateChange} value={selectedDate} />
      {dostepneTerminy.length > 0 ? (
        <div>
          <h2>Dostępne terminy na {selectedDate.toLocaleDateString()}</h2>
          <ul>
            {dostepneTerminy.map((termin, index) => (
              <li key={index}>
                Data i godzina: {termin.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Brak dostępnych terminów na wybrany dzień.</p>
      )}
    </div>
  );
};

export default DostepneTerminy;
