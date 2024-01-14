import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import NavigationBar from './NavigationBar'
import {Typography, Box, Grid, CardContent, Card, Button, styled, Dialog, DialogActions,
        DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';

const StyledButton = styled(Button)({
  marginTop: '16px',
  backgroundColor: '#26a197',
  transition: 'transform 0.2s', // Dodajemy transition dla efektu płynnego przejścia

  ':hover': {
    transform: 'scale(1.1)', // Zmieniamy rozmiar na 110% po najechaniu kursorem
    backgroundColor: '#26a197 !important', // Ustawiamy kolor tła na stałe, ignorując domyślne style
  },
});

const DostepneTerminy = () => {
  const { lekarzId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dostepneTerminy, setDostepneTerminy] = useState([]);
  const [godzinyPracy, setGodzinyPracy] = useState({ start: '08:00', koniec: '16:00' });
  const [rok, setRok] = useState(selectedDate.getFullYear());
  const [miesiac, setMiesiac] = useState(selectedDate.getMonth() + 1);
  const [dzien, setDzien] = useState(selectedDate.getDate());
  const [godzina, setGodzina] = useState(''); // Dodaj godzinę
  const [minuta, setMinuta] = useState(''); // Dodaj minutę
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleReservationClick = (termin) => {
    if (isAuthenticated) {

      const wybranaGodzina = termin.getHours().toString().padStart(2, '0');
      const wybraneMinuty =  termin.getMinutes().toString().padStart(2, '0');

      // Przekieruj do podstrony rezerwacji
      window.location.href = `/rezerwacje/${lekarzId}/${rok}/${miesiac}/${dzien}/${wybranaGodzina}/${wybraneMinuty}`;
    } else {
      const wybranaGodzina = termin.getHours().toString().padStart(2, '0');
      const wybraneMinuty =  termin.getMinutes().toString().padStart(2, '0');

      // Wyświetl okno dialogowe
      setOpenDialog(true);
      // Zapisz informacje o wybranym terminie w localStorage
      localStorage.setItem('selectedAppointment', JSON.stringify({
        lekarzId,
        rok,
        miesiac,
        dzien,
        godzina: wybranaGodzina,
        minuta: wybraneMinuty,
      }));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
      <NavigationBar />
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
                        <StyledButton variant="contained" onClick={() => handleReservationClick(termin)}>
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

        {/* Dialog dla niezalogowanego użytkownika */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Zaloguj się lub zarejestruj</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Aby dokonać rezerwacji, musisz być zalogowany. Jeśli nie masz jeszcze konta, zarejestruj się.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Zamknij</Button>
            <Button component={Link} to="/login" color="primary">
              Zaloguj się
            </Button>
            <Button component={Link} to="/rejestracja" color="primary">
              Zarejestruj się
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default DostepneTerminy;
