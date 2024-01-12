import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const DoctorPanel = ({ userData }) => {
  const [wizyty, setWizyty] = useState({ zaplanowane: [], odbyte: [] });
  const [error, setError] = useState(null);
  const [diagnoza, setDiagnoza] = useState('');
  const [przepisaneLeki, setPrzepisaneLeki] = useState('');
  const [notatkiLekarza, setNotatkiLekarza] = useState('');

  const fetchWizyty = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/wizyty/${userData.id}/lekarz/`);
      const { zaplanowane, odbyte } = response.data;
      setWizyty({ zaplanowane, odbyte });
      setError(null);
    } catch (error) {
      console.error('Błąd pobierania danych o wizytach lekarza', error);
      setError('Wystąpił błąd podczas pobierania danych o wizytach lekarza.');
    }
  };

  const updateVisit = async (wizytaId, newData) => {
    try {
      // Filtruj dane, aby usunąć puste wartości
      const filteredData = Object.fromEntries(
        Object.entries(newData).filter(([_, value]) => value !== null && value !== '')
      );

      const response = await axios.post(`http://localhost:8000/api/wizyty/${wizytaId}/update/`, filteredData);
      console.log('Response from server:', response);
      fetchWizyty();
    } catch (error) {
      console.error('Błąd podczas aktualizacji wizyty', error);
      if (error.response) {
        console.error('Response data from server:', error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchWizyty();
  }, [userData.id]);

  return (
    <div>
      <Typography variant="h5">Panel Lekarza</Typography>
      <p>Imię: {userData.imie}</p>
      <p>Nazwisko: {userData.nazwisko}</p>
      <p>Specjalizacja: {userData.specjalizacja}</p>

      <div>
        <Typography variant="h6">Wizyty lekarza:</Typography>
        <div>
          <Typography variant="subtitle1">Zaplanowane:</Typography>
          <ul>
            {wizyty.zaplanowane.map((wizyta) => (
              <li key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Opis pacjenta: {wizyta.opis || 'Brak danych o opisie'}
                <br />
                Status: {wizyta.status}
                <br />
                <select
                  value={wizyta.status}
                  onChange={(e) => updateVisit(wizyta.id, { status: e.target.value })}
                >
                  <option value="zaplanowana">Zaplanowana</option>
                  <option value="odbyta">Odbyta</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Typography variant="subtitle1">Odbyte:</Typography>
          <ul>
            {wizyty.odbyte.map((wizyta) => (
              <li key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Diagnoza: {wizyta.diagnoza || 'Brak diagnozy'}
                <br />
                Przepisane leki: {wizyta.przepisane_leki || 'Brak przepisanych leków'}
                <br />
                Notatki lekarza: {wizyta.notatki_lekarza || 'Brak notatek lekarza'}
                <br />
                {wizyta.status === 'odbyta' && (
                  <div>
                    <TextField
                      label="Diagnoza"
                      value={diagnoza === null ? '' : diagnoza}
                      onChange={(e) => setDiagnoza(e.target.value)}
                    />
                    <TextField
                      label="Przepisane leki"
                      value={przepisaneLeki === null ? '' : przepisaneLeki}
                      onChange={(e) => setPrzepisaneLeki(e.target.value)}
                    />
                    <TextField
                      label="Notatki lekarza"
                      value={notatkiLekarza === null ? '' : notatkiLekarza}
                      onChange={(e) => setNotatkiLekarza(e.target.value)}
                    />
                    <button onClick={() => updateVisit(wizyta.id, { diagnoza, przepisaneLeki, notatkiLekarza })}>
                      Zapisz zmiany
                    </button>
                  </div>
                )}
                <select
                  value={wizyta.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (
                      (wizyta.status === 'zaplanowana' && newStatus === 'odbyta') ||
                      (wizyta.status === 'odbyta' && newStatus === 'zaplanowana')
                    ) {
                      const confirmed = window.confirm(
                        'Czy na pewno chcesz zmienić status wizyty? Może to wpłynąć na poprawność danych.'
                      );
                      if (!confirmed) {
                        return;
                      }
                    }
                    updateVisit(wizyta.id, { status: newStatus });
                  }}
                >
                  <option value="zaplanowana">Zaplanowana</option>
                  <option value="odbyta">Odbyta</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {error && (
        <Snackbar open={true} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default DoctorPanel;
