import React, { useState } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

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
        setEtapRejestracji(2);
      })
      .catch((error) =>{
        console.error('Błąd rejestracji pacjenta:', error);
        console.error('Response data:', error.response.data);
        }
      );
  };

  const renderujEtapRejestracji = () => {
    switch (etapRejestracji) {
      case 1:
        return (
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
        );
      case 2:
        return (
          <div>
            <Typography variant="h5">
              Rejestracja Pacjenta - Potwierdzenie
            </Typography>
            <Typography variant="body1">
              Dziękujemy za rejestrację!
            </Typography>
            {/* Możesz dodać przycisk do przekierowania na stronę logowania */}
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderujEtapRejestracji()}</div>;
};

export default Rejestracja;
