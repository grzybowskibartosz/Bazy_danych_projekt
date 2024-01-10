import React, { useState, useEffect } from 'react';
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

import axios from 'axios';
import logo from './logo.png';

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

const NasiLekarze = () => {
  const navigate = useNavigate();  // Zmiana na useNavigate
  const [lekarze, setLekarze] = useState([]);

  useEffect(() => {
    // Pobierz dane o lekarzach z API
    axios.get('http://localhost:8000/api/nasi-lekarze/')
      .then(response => setLekarze(response.data))
      .catch(error => console.error('Błąd pobierania danych o lekarzach:', error));
  }, []);

  const handleDostepneTerminyClick = (lekarzId) => {
    // Przenieś użytkownika do strony z dostępnymi terminami danego lekarza
    navigate(`/dostepne-terminy/${lekarzId}`);
  };

  return (
    <Box>
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

      <Box m={4}>
        <Typography variant="h4" mb={3}>
          Nasi lekarze
        </Typography>
        <Grid container spacing={3}>
          {lekarze.map(lekarz => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={lekarz.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {`${lekarz.imie} ${lekarz.nazwisko}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {lekarz.specjalizacja}
                  </Typography>
                  <Button color="primary" component={Link} to={`/dostepne-terminy/${lekarz.id}`}>
                    Dostępne terminy
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default NasiLekarze;
