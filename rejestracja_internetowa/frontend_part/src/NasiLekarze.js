import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Box, Grid, Card, CardContent, Button, Typography, TextField} from '@material-ui/core';
import NavigationBar from './NavigationBar'


const NasiLekarze = () => {
  const [lekarze, setLekarze] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    // Pobierz dane o lekarzach z API
    axios.get('http://localhost:8000/api/nasi-lekarze/')
      .then(response => setLekarze(response.data))
      .catch(error => console.error('Błąd pobierania danych o lekarzach:', error));
  }, []);

  const filteredLekarze = lekarze.filter(lekarz =>
        lekarz.imie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lekarz.nazwisko.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lekarz.specjalizacja.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Box>
      <NavigationBar />

      <Box m={4}>
        <Typography variant="h4" mb={3}>
          Nasi lekarze
        </Typography>

        <TextField
          label="Szukaj lekarza"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Grid container spacing={3}>
          {filteredLekarze.map(lekarz => (
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
