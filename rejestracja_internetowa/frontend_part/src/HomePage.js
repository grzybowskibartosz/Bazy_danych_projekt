import React from 'react';
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
  justifyContent: 'flex start',
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
      </StyledCenteredColumn>
    </div>
  );
};

export default HomePage;
