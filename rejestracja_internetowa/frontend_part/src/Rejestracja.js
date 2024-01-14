import React, { useState } from 'react';
import axios from 'axios';
import {Typography, TextField, Button, Paper} from '@material-ui/core';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import NavigationBar from './NavigationBar';

const StyledButtonsContainer = styled('div')({
  display: 'flex',
  gap: '10px',
  marginLeft: 'auto',
});

const StyledFormContainer = styled('div')({
  width: '50%',
  margin: '0 auto',
  marginTop: '50px',
});

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const StyledButton = styled(Button)({
  marginTop: '16px',
  backgroundColor: '#26a197'
});

const Rejestracja = () => {
  const [etapRejestracji, setEtapRejestracji] = useState(1);
  const [nowyPacjent, setNowyPacjent] = useState({
    imie: '',
    nazwisko: '',
    pesel: '',
    data_urodzenia: '',
    adres: '',
    email: '',
    haslo: '',
    inne_informacje: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNowyPacjent((prevPacjent) => ({
      ...prevPacjent,
      [name]: value,
    }));
  };

  const zarejestrujPacjenta = () => {
    axios.post('http://localhost:8000/api/rejestracja/', nowyPacjent)
      .then((response) => {
        console.log('Pacjent zarejestrowany:', response.data);
        // Przekieruj użytkownika na stronę logowania lub potwierdzenia rejestracji

        const selectedAppointment = localStorage.getItem('selectedAppointment');

        if (selectedAppointment) {
          const {
            lekarzId,
            rok,
            miesiac,
            dzien,
            godzina,
            minuta,
          } = JSON.parse(selectedAppointment);
          window.location.href = `/login`;

        } else {
          setEtapRejestracji(2);
        }
      })
      .catch((error) => {
        console.error('Błąd rejestracji pacjenta:', error);

        // Sprawdź, czy istnieje odpowiedź od serwera
        if (error.response) {
          console.error('Response data:', error.response.data);
        } else {
          console.error('Brak odpowiedzi od serwera');
        }

        // Tutaj możesz dodać dodatkową obsługę błędu, np. wyświetlenie komunikatu dla użytkownika
      });
  };


  const renderujEtapRejestracji = () => {
    switch (etapRejestracji) {
      case 1:
        return (
        <div>
          <NavigationBar />
          <StyledFormContainer>
            <Typography variant="h5">Rejestracja Pacjenta - Etap 1</Typography>
            <StyledForm>
              <TextField
                label="Imię"
                name="imie"
                value={nowyPacjent.imie}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Nazwisko"
                name="nazwisko"
                value={nowyPacjent.nazwisko}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="PESEL"
                name="pesel"
                value={nowyPacjent.pesel}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Data Urodzenia"
                name="data_urodzenia"
                value={nowyPacjent.data_urodzenia}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Adres"
                name="adres"
                value={nowyPacjent.adres}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="E-mail"
                name="email"
                value={nowyPacjent.email}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Hasło"
                name="haslo"
                value={nowyPacjent.haslo}
                onChange={handleInputChange}
                variant="outlined"
                type="password"
              />
              <TextField
                label="Inne informacje"
                name="inne_informacje"
                value={nowyPacjent.inne_informacje}
                onChange={handleInputChange}
                variant="outlined"
              />
              <StyledButton
                variant="contained"
                color="primary"
                onClick={zarejestrujPacjenta}
              >
                Zarejestruj Pacjenta
              </StyledButton>
            </StyledForm>
          </StyledFormContainer>
        </div>
        );
      case 2:
        return (
          <Paper elevation={3} style={{ padding: 20, textAlign: 'center', margin: '20px auto', maxWidth: 400 }}>
          <Typography variant="h5">Rejestracja przebiegła pomyślnie!</Typography>
          <Typography variant="body1">
            Dziękujemy za rejestrację! Możesz teraz przejść do strony logowania.
          </Typography>
          {/* Możesz dodać przycisk do przekierowania na stronę logowania */}
          <Button component={Link} to="/login" variant="contained" color='#primary' style={{ marginTop: 20, backgroundColor: '#26a197', color: 'white' }}>
            Przejdź do logowania
          </Button>
        </Paper>
        );
      default:
        return null;
    }
  };

  return <div>{renderujEtapRejestracji()}</div>;
};

export default Rejestracja;
