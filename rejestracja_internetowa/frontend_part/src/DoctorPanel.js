import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Paper,
  styled,
} from '@material-ui/core';
import axios from 'axios';

const StyledWizytaTextarea = styled('textarea')({
  width: '100%',
  height: '80px',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  resize: 'vertical',
  marginBottom: '8px',
});

const StyledAppointment = styled('div')({
  border: '1px solid #ccc',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
});

const StyledDoctorInfoContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ccc',
  padding: '16px',
  borderRadius: '8px',
  width: '50%', // Dostosuj szerokość według potrzeb
  margin: '0 auto', // Wyśrodkowanie ramki na stronie
  marginTop: '50px',
});

const StyledButton = styled(Button)({
  marginTop: '16px',
  backgroundColor: '#26a197',
  width: '30%',
  alignSelf: 'center'
});

const StyledButton2 = styled(Button)({
  marginTop: '16px',
  width: '30%',
  alignSelf: 'center'
});

const StyledSearchContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const StyledSelect = styled(Select)({
  width: '100%', // Dostosuj szerokość według potrzeb
  marginTop: '8px', // Dostosuj margines według potrzeb
});

const StyledFormControl = styled(FormControl)({
  width: '30%', // Dostosuj szerokość według potrzeb
  marginTop: '8px',
  marginBottom: '8px',
});

const DoctorPanel = ({ userData }) => {
  const [wizyty, setWizyty] = useState({ zaplanowane: [], odbyte: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editedWizytaId, setEditedWizytaId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWizyty, setFilteredWizyty] = useState(null);



  const fetchWizyty = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/wizyty/${userData.id}/lekarz/`);
      const { zaplanowane, odbyte } = response.data;
      setWizyty({ zaplanowane, odbyte });
      setFilteredWizyty(null);
    } catch (error) {
      console.error('Błąd pobierania danych o wizytach lekarza', error);
    }
  };

  useEffect(() => {
    fetchWizyty();
  }, [userData.id]);

  const handleZmienStatusWizyty = async (wizytaId, nowyStatus) => {
    try {
      // Dodaj warunek dla zmiany z "Odbytej" na "Zaplanowaną"
      if (nowyStatus === 'Zaplanowana') {
        const confirmed = window.confirm('Czy na pewno chcesz zmienić status na Zaplanowaną?');
        if (!confirmed) {
          return;
        }
      }

      await axios.put(`http://localhost:8000/api/wizyty/${wizytaId}/zmien_status/`, { status: nowyStatus });
      // Odśwież listę wizyt po zmianie statusu
      fetchWizyty();
    } catch (error) {
      console.error('Błąd podczas zmiany statusu wizyty:', error);
    }
  };

const handleEdytujPolaWizyty = async (wizytaId, polaDoEdycji) => {
    try {
        await axios.put(`http://localhost:8000/api/wizyty/${wizytaId}/edytuj-pola/`, polaDoEdycji);
        // Odśwież listę wizyt po edycji pól
        fetchWizyty();

        setIsEditing(true);

    } catch (error) {
        console.error('Błąd podczas edycji pól wizyty:', error);
    }
};

const handleEdytujDaneWizyty = (wizytaId) => {
    setIsEditing(true);
    setEditedWizytaId(wizytaId);
  };

    const handleZapiszDaneWizyty = () => {
    setIsEditing(false);
    setEditedWizytaId(null);
    // ... (możesz dodać logikę do zapisywania danych na serwerze, jeśli jest taka potrzeba)
  };



      const filteredZaplanowane = wizyty.zaplanowane.filter((wizyta) =>
        wizyta.pacjent.imie.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wizyta.pacjent.nazwisko.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wizyta.data_i_godzina.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredOdbyte = wizyty.odbyte.filter((wizyta) =>
        wizyta.pacjent.imie.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wizyta.pacjent.nazwisko.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wizyta.data_i_godzina.toLowerCase().includes(searchQuery.toLowerCase())

      );




  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredWizyty(null);
  };
return (
  <div>
    <StyledDoctorInfoContainer>
      <Typography variant="h5">Panel Lekarza</Typography>
      <p>Imię i nazwisko: {userData.imie} {userData.nazwisko}</p>
      <p>Specjalizacja: {userData.specjalizacja}</p>
    </StyledDoctorInfoContainer>

    <StyledAppointment>
      <Typography variant="h6">Twoje wizyty:</Typography>

      <StyledSearchContainer>
        <TextField
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Wyszukaj pacjenta..."
        />
          <StyledButton variant="contained" color="primary" >
            Szukaj
          </StyledButton>
          <StyledButton2 variant="outlined" color="secondary" onClick={handleResetSearch}>
            Resetuj wyszukiwanie
          </StyledButton2>
      </StyledSearchContainer>

      <StyledAppointment>
        <Typography variant="subtitle1">Zaplanowane:</Typography>
        <ul>
          {filteredWizyty && filteredWizyty.zaplanowane.length > 0 ? (
            filteredZaplanowane.map((wizyta) => (
              <StyledAppointment key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Opis dolegliwości: {wizyta.opis || 'Brak danych o opisie'}
                <br />
                Status: {wizyta.status}
                <br />
                <StyledFormControl>
                    <InputLabel id="status-label">Status</InputLabel>
                    <StyledSelect
                    labelId="status-label"
                    value={wizyta.status}
                    onChange={(e) => handleZmienStatusWizyty(wizyta.id, e.target.value)}
                    label="Status"
                    >
                        <MenuItem value="Odbyta">Odbyta</MenuItem>
                        <MenuItem value="Zaplanowana">Zaplanowana</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
                <br />
                {isEditing && editedWizytaId === wizyta.id ? (
                  <div>
                    Diagnoza:
                    <StyledWizytaTextarea
                      value={wizyta.diagnoza}
                      onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { diagnoza: e.target.value })}
                    />
                    <br />
                    Przepisane leki:
                    <StyledWizytaTextarea
                      value={wizyta.przepisane_leki}
                      onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { przepisane_leki: e.target.value })}
                    />
                    <br />
                    Notatki lekarza:
                    <StyledWizytaTextarea
                      value={wizyta.notatki_lekarza}
                      onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { notatki_lekarza: e.target.value })}
                    />
                    <br />
                    <StyledButton onClick={handleZapiszDaneWizyty}>Zapisz dane wizyty</StyledButton>
                  </div>
                ) : (
                  <StyledButton onClick={() => handleEdytujDaneWizyty(wizyta.id)}>Edytuj dane wizyty</StyledButton>
                )}
              </StyledAppointment>
            ))
          ) : (
            filteredZaplanowane.map((wizyta) => (
              <StyledAppointment key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Opis dolegliwości: {wizyta.opis || 'Brak danych o opisie'}
                <br />
                Status: {wizyta.status}
                <br />
                <StyledFormControl>
                    <InputLabel id="status-label">Status</InputLabel>
                    <StyledSelect
                    labelId="status-label"
                    value={wizyta.status}
                    onChange={(e) => handleZmienStatusWizyty(wizyta.id, e.target.value)}
                    label="Status"
                    >
                        <MenuItem value="Odbyta">Odbyta</MenuItem>
                        <MenuItem value="Zaplanowana">Zaplanowana</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
              </StyledAppointment>
            ))
          )}
        </ul>
      </StyledAppointment>
      <StyledAppointment>
        <Typography variant="subtitle1">Odbyte:</Typography>
        <ul>
          {filteredWizyty && filteredWizyty.odbyte.length > 0 ? (
            filteredOdbyte.map((wizyta) => (
              <StyledAppointment key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Diagnoza: {isEditing && editedWizytaId === wizyta.id ? (
                  <StyledWizytaTextarea
                    value={wizyta.diagnoza}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { diagnoza: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.diagnoza || 'Brak danych o diagnozie'}</span>
                )}
                <br />
                Przepisane leki: {isEditing && editedWizytaId === wizyta.id ? (
                  <StyledWizytaTextarea
                    value={wizyta.przepisane_leki}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { przepisane_leki: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.przepisane_leki || 'Brak danych o przepisanych lekach'}</span>
                )}
                <br />
                Notatki lekarza: {isEditing && editedWizytaId === wizyta.id ? (
                  <StyledWizytaTextarea
                    value={wizyta.notatki_lekarza}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { notatki_lekarza: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.notatki_lekarza || 'Brak notatek lekarza'}</span>
                )}
                <br />
                Opis dolegliwości przez pacjenta: {wizyta.opis || 'Brak danych o opisie'}
                <br />
                Status: {wizyta.status}
                <br />
                <StyledFormControl>
                    <InputLabel id="status-label">Status</InputLabel>
                    <StyledSelect
                    labelId="status-label"
                    value={wizyta.status}
                    onChange={(e) => handleZmienStatusWizyty(wizyta.id, e.target.value)}
                    label="Status"
                    >
                        <MenuItem value="Odbyta">Odbyta</MenuItem>
                        <MenuItem value="Zaplanowana">Zaplanowana</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
                <br />
                {isEditing && editedWizytaId === wizyta.id ? (
                  <StyledButton onClick={handleZapiszDaneWizyty}>Zapisz dane wizyty</StyledButton>
                ) : (
                  <StyledButton onClick={() => handleEdytujDaneWizyty(wizyta.id)}>Edytuj dane wizyty</StyledButton>
                )}
              </StyledAppointment>
            ))
          ) : (
            filteredOdbyte.map((wizyta) => (
              <StyledAppointment key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Diagnoza: {isEditing && editedWizytaId === wizyta.id ? (
                  <StyledWizytaTextarea
                    value={wizyta.diagnoza}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { diagnoza: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.diagnoza || 'Brak danych o diagnozie'}</span>
                )}
                <br />
                Przepisane leki: {isEditing && editedWizytaId === wizyta.id ? (
                  <StyledWizytaTextarea
                    value={wizyta.przepisane_leki}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { przepisane_leki: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.przepisane_leki || 'Brak danych o przepisanych lekach'}</span>
                )}
                <br />
                Notatki lekarza: {isEditing && editedWizytaId === wizyta.id ? (
                  <StyledWizytaTextarea
                    value={wizyta.notatki_lekarza}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { notatki_lekarza: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.notatki_lekarza || 'Brak notatek lekarza'}</span>
                )}
                <br />
                Opis dolegliwości przez pacjenta: {wizyta.opis || 'Brak danych o opisie'}
                <br />
                Status: {wizyta.status}
                <br />
                <StyledFormControl>
                    <InputLabel id="status-label">Status</InputLabel>
                    <StyledSelect
                    labelId="status-label"
                    value={wizyta.status}
                    onChange={(e) => handleZmienStatusWizyty(wizyta.id, e.target.value)}
                    label="Status"
                    >
                        <MenuItem value="Odbyta">Odbyta</MenuItem>
                        <MenuItem value="Zaplanowana">Zaplanowana</MenuItem>
                    </StyledSelect>
                </StyledFormControl>
                <br />
                {isEditing && editedWizytaId === wizyta.id ? (
                  <StyledButton onClick={handleZapiszDaneWizyty}>Zapisz dane wizyty</StyledButton>
                ) : (
                  <StyledButton onClick={() => handleEdytujDaneWizyty(wizyta.id)}>Edytuj dane wizyty</StyledButton>
                )}
              </StyledAppointment>
            ))
          )}
        </ul>
      </StyledAppointment>
    </StyledAppointment>
  </div>
);
};

export default DoctorPanel;