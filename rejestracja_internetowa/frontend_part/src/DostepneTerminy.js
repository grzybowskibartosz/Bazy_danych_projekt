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
import { Link } from 'react-router-dom';

const StyledButton = styled(Button)({
  marginTop: '16px',
  backgroundColor: '#26a197'
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#26a197',
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 1000,
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'flex-start',
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
  const [godzinyPracy, setGodzinyPracy] = useState({ start: '08:00', koniec: '16:00' });
  const [rok, setRok] = useState(selectedDate.getFullYear());
  const [miesiac, setMiesiac] = useState(selectedDate.getMonth() + 1);
  const [dzien, setDzien] = useState(selectedDate.getDate());

  useEffect(() => {
    if (lekarzId) {
      axios.get(`http://localhost:8000/api/zajete-terminy-nowy/${lekarzId}/${rok}/${miesiac}/${dzien}/`)
        .then(response => {
          const zajeteTerminy = response.data.zajete_terminy.map(date => new Date(date));
          const godzinyPracy = response.data.godziny_pracy;

          setGodzinyPracy(godzinyPracy);

          const wszystkieTerminy = generujWszystkieTerminy(selectedDate);
          const dostepneTerminy = wszystkieTerminy.filter(termin => !czyTerminJestZajety(termin, zajeteTerminy));

          setDostepneTerminy(dostepneTerminy);
        })
        .catch(error => console.error('Błąd pobierania informacji o godzinach pracy lekarza:', error));
    }
  }, [lekarzId, selectedDate, rok, miesiac, dzien]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setRok(date.getFullYear());
    setMiesiac(date.getMonth() + 1);
    setDzien(date.getDate());
  };

  const generujWszystkieTerminy = (selectedDate) => {
    const terminy = [];
    const startHour = parseInt(godzinyPracy.start.split(':')[0], 10);
    const endHour = parseInt(godzinyPracy.koniec.split(':')[0], 10);
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
            <Button color="inherit" component={Link} to="/login">
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
      <Box ml={40} mr={40} mt={12}>
        <h1>Dostępne terminy</h1>
        <Calendar onChange={handleDateChange} value={selectedDate} />
        {dostepneTerminy.length > 0 ? (
          <div>
            <h2>Dostępne terminy na {selectedDate.toLocaleDateString()}</h2>
            <Grid container spacing={2}>
              {dostepneTerminy.map((termin, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        Data i godzina:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {termin.toLocaleString()}
                      </Typography>
                      <StyledButton
                       variant="contained"
                       color="primary">
                        Rezerwacja
                      </StyledButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ) : (
          <p>Brak dostępnych terminów na wybrany dzień.</p>
        )}
      </Box>
    </div>
  );
};

export default DostepneTerminy;
