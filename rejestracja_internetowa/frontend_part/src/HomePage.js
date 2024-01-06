import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import logo from './logo.png';

// ustalamy kolor tła
const StyledAppBar = styled(AppBar)({
  backgroundColor: '#26a197',
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

const StyledCenteredColumn = styled('div')({
  backgroundColor: '#e0e0e0',
  width: '50%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100vh',
});

const StyledLogo = styled('img')({
  height: '70px',  // Zmieniona wysokość
  margin: '10px 0',
});

const HomePage = () => {
  const [dostepneWizyty, setDostepneWizyty] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wywołaj funkcję do pobrania dostępnych wizyt
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dostepne-wizyty/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDostepneWizyty(data);
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
        setError(error.message || 'Wystąpił błąd podczas pobierania danych.');
      }
    };

    // Wywołaj funkcję przy montowaniu komponentu
    fetchData();
  }, []); // Pusta tablica oznacza, że useEffect zostanie wywołany tylko raz, po zamontowaniu komponentu

  return (
    <div>
      <StyledAppBar position="static">
        <StyledToolbar>
          <StyledLogo src={logo} alt="PolwroMED Logo" />
          <Typography variant="h6">
            PolwroMED
          </Typography>
          <StyledButtonsContainer>
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

      <StyledCenteredColumn>
        <Typography variant="h5">
          Witaj na stronie głównej aplikacji PolwroMED!
        </Typography>
        <Typography variant="h5">
          Jest to projekt na kurs Bazy Danych autorstwa Mikołaja Załoga i
          Bartosza Grzybowskiego. Obsługa internetowej rejestracji pacjentów w
          prywatnych praktykach medycznych dla osób prowadzących jednoosobową
          działalność ale też dla dużych przedsiębiorstw służby zdrowa.
        </Typography>
        <Typography variant="h5">
          Prowadzący projekt: dr. inż. Radosław Idzikowski.
        </Typography>
        <p>Tutaj możesz dodać swój tekst lub inne elementy.</p>

        {error ? (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        ) : (
          <>
            <Typography variant="h5">Dostępne wizyty:</Typography>
            <ul>
              {dostepneWizyty.map(wizyta => (
                <li key={wizyta.id}>{wizyta.lekarz} - {wizyta.data_i_godzina}</li>
              ))}
            </ul>
          </>
        )}
      </StyledCenteredColumn>
    </div>
  );
};

export default HomePage;
