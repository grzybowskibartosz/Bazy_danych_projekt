import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const DoctorPanel = ({ userData }) => {
  const [wizyty, setWizyty] = useState({ zaplanowane: [], odbyte: [] });

  useEffect(() => {
    const fetchWizyty = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/wizyty/${userData.id}/lekarz/`);
        const { zaplanowane, odbyte } = response.data;
        setWizyty({ zaplanowane, odbyte });
      } catch (error) {
        console.error('Błąd pobierania danych o wizytach lekarza', error);
      }
    };

    fetchWizyty();
  }, [userData.id]);

const handleStatusChange = async (wizytaId, nowyStatus) => {
    try {
      await axios.post(`http://localhost:8000/api/wizyty/${wizytaId}/zmien_status/`, { status: nowyStatus });
      // Zaktualizuj stan po zmianie statusu
      const noweWizyty = {
        zaplanowane: wizyty.zaplanowane.map(wizyta =>
          wizyta.id === wizytaId ? { ...wizyta, status: nowyStatus } : wizyta
        ),
        odbyte: wizyty.odbyte.map(wizyta =>
          wizyta.id === wizytaId ? { ...wizyta, status: nowyStatus } : wizyta
        ),
      };
      setWizyty(noweWizyty);
    } catch (error) {
      console.error('Błąd podczas zmiany statusu wizyty:', error);
    }
};

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
                Status: {wizyta.status}
                <br />
                {wizyta.status.toLowerCase() === 'zaplanowana' && (
                  <button onClick={() => handleStatusChange(wizyta.id, 'Odbyta')}>
                    Zmień status na Odbyta
                  </button>
                )}
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
                Status: {wizyta.status}
                <br />
                {wizyta.status.toLowerCase() === 'odbyta' && (
                  <button onClick={() => handleStatusChange(wizyta.id, 'Zaplanowana')}>
                    Zmień status na Zaplanowana
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorPanel;
