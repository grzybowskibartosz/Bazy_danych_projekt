import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';

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

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredWizyty(null);  // Jeśli pole wyszukiwania jest puste, resetujemy wyniki
    } else {
      const filteredZaplanowane = wizyty.zaplanowane.filter((wizyta) =>
        wizyta.pacjent.imie.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wizyta.pacjent.nazwisko.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredOdbyte = wizyty.odbyte.filter((wizyta) =>
        wizyta.pacjent.imie.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wizyta.pacjent.nazwisko.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredWizyty({ zaplanowane: filteredZaplanowane, odbyte: filteredOdbyte });
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredWizyty(null);
  };

return (
  <div>
    <Typography variant="h5">Panel Lekarza</Typography>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Wyszukaj pacjenta..."
    />
    <button onClick={handleSearch}>Szukaj</button>
    <button onClick={handleResetSearch}>Resetuj wyszukiwanie</button>

    <p>Imię: {userData.imie}</p>
    <p>Nazwisko: {userData.nazwisko}</p>
    <p>Specjalizacja: {userData.specjalizacja}</p>

    <div>
      <Typography variant="h6">Wizyty lekarza:</Typography>
      <div>
        <Typography variant="subtitle1">Zaplanowane:</Typography>
        <ul>
          {filteredWizyty && filteredWizyty.zaplanowane.length > 0 ? (
            filteredWizyty.zaplanowane.map((wizyta) => (
              <li key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Opis dolegliwości: {wizyta.opis || 'Brak danych o opisie'}
                <br />
                Status: {wizyta.status}
                <br />
                <select
                  value={wizyta.status}
                  onChange={(e) => handleZmienStatusWizyty(wizyta.id, e.target.value)}
                >
                  <option value="Zaplanowana">Zaplanowana</option>
                  <option value="Odbyta">Odbyta</option>
                </select>
                <br />
                {isEditing && editedWizytaId === wizyta.id ? (
                  <div>
                    Diagnoza:
                    <textarea
                      value={wizyta.diagnoza}
                      onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { diagnoza: e.target.value })}
                    />
                    <br />
                    Przepisane leki:
                    <textarea
                      value={wizyta.przepisane_leki}
                      onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { przepisane_leki: e.target.value })}
                    />
                    <br />
                    Notatki lekarza:
                    <textarea
                      value={wizyta.notatki_lekarza}
                      onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { notatki_lekarza: e.target.value })}
                    />
                    <br />
                    <button onClick={handleZapiszDaneWizyty}>Zapisz dane wizyty</button>
                  </div>
                ) : (
                  <button onClick={() => handleEdytujDaneWizyty(wizyta.id)}>Edytuj dane wizyty</button>
                )}
              </li>
            ))
          ) : (
            wizyty.zaplanowane.map((wizyta) => (
              <li key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Opis dolegliwości: {wizyta.opis || 'Brak danych o opisie'}
                <br />
                Status: {wizyta.status}
                <br />
                <select
                  value={wizyta.status}
                  onChange={(e) => handleZmienStatusWizyty(wizyta.id, e.target.value)}
                >
                  <option value="Zaplanowana">Zaplanowana</option>
                  <option value="Odbyta">Odbyta</option>
                </select>
              </li>
            ))
          )}
        </ul>
      </div>
      <div>
        <Typography variant="subtitle1">Odbyte:</Typography>
        <ul>
          {filteredWizyty && filteredWizyty.odbyte.length > 0 ? (
            filteredWizyty.odbyte.map((wizyta) => (
              <li key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Diagnoza: {isEditing && editedWizytaId === wizyta.id ? (
                  <textarea
                    value={wizyta.diagnoza}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { diagnoza: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.diagnoza || 'Brak danych o diagnozie'}</span>
                )}
                <br />
                Przepisane leki: {isEditing && editedWizytaId === wizyta.id ? (
                  <textarea
                    value={wizyta.przepisane_leki}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { przepisane_leki: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.przepisane_leki || 'Brak danych o przepisanych lekach'}</span>
                )}
                <br />
                Notatki lekarza: {isEditing && editedWizytaId === wizyta.id ? (
                  <textarea
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
                <select
                  value={wizyta.status}
                  onChange={(e) => handleZmienStatusWizyty(wizyta.id, e.target.value)}
                >
                  <option value="Odbyta">Odbyta</option>
                  <option value="Zaplanowana">Zaplanowana</option>
                </select>
                <br />
                {isEditing && editedWizytaId === wizyta.id ? (
                  <button onClick={handleZapiszDaneWizyty}>Zapisz dane wizyty</button>
                ) : (
                  <button onClick={() => handleEdytujDaneWizyty(wizyta.id)}>Edytuj dane wizyty</button>
                )}
              </li>
            ))
          ) : (
            wizyty.odbyte.map((wizyta) => (
              <li key={wizyta.id}>
                Data i godzina: {new Date(wizyta.data_i_godzina).toLocaleString()} | Pacjent: {wizyta.pacjent.imie} {wizyta.pacjent.nazwisko}
                <br />
                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                <br />
                Diagnoza: {isEditing && editedWizytaId === wizyta.id ? (
                  <textarea
                    value={wizyta.diagnoza}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { diagnoza: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.diagnoza || 'Brak danych o diagnozie'}</span>
                )}
                <br />
                Przepisane leki: {isEditing && editedWizytaId === wizyta.id ? (
                  <textarea
                    value={wizyta.przepisane_leki}
                    onChange={(e) => handleEdytujPolaWizyty(wizyta.id, { przepisane_leki: e.target.value })}
                  />
                ) : (
                  <span>{wizyta.przepisane_leki || 'Brak danych o przepisanych lekach'}</span>
                )}
                <br />
                Notatki lekarza: {isEditing && editedWizytaId === wizyta.id ? (
                  <textarea
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
                <select
                  value={wizyta.status}
                  onChange={(e) => handleZmienStatusWizyty(wizyta.id, e.target.value)}
                >
                  <option value="Odbyta">Odbyta</option>
                  <option value="Zaplanowana">Zaplanowana</option>
                </select>
                <br />
                {isEditing && editedWizytaId === wizyta.id ? (
                  <button onClick={handleZapiszDaneWizyty}>Zapisz dane wizyty</button>
                ) : (
                  <button onClick={() => handleEdytujDaneWizyty(wizyta.id)}>Edytuj dane wizyty</button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  </div>
);

};

export default DoctorPanel;
