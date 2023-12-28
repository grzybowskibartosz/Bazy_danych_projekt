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
import { Link } from 'react-router-dom';
import axios from 'axios';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#26a197',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledButtonsContainer = styled('div')({
  display: 'flex',
  gap: '8px',
});

const NasiLekarze = () => {
  const [lekarze, setLekarze] = useState([]);

  useEffect(() => {
    // Pobierz dane o lekarzach z API
    axios.get('http://localhost:8000/api/nasi-lekarze/')
      .then(response => setLekarze(response.data))
      .catch(error => console.error('Błąd pobierania danych o lekarzach:', error));
  }, []);

  return (
    <Box>
      <StyledAppBar position="static">
        <StyledToolbar>
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
