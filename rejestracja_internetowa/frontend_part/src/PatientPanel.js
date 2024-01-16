import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, Select, MenuItem,
         FormControl, InputLabel, TextareaAutosize, Paper, styled } from '@material-ui/core';
import axios from 'axios';

const StyledWizytaTextarea = styled('textarea')({
  width: '100%',
  height: '30px',
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
  justifyContent: 'space-between', // Wyrównaj elementy do krawędzi kontenera

});

const StyledText = styled('div')({
  textAlign: 'left',
});

const StyledButtons = styled('div')({
  marginRight: 'auto',
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

const StyledButton3 = styled(Button)({
  marginTop: '16px',
  backgroundColor: '#26a197',
  width: '30%',
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

const PatientPanel = ({ userData }) => {
    const [mojeWizyty, setMojeWizyty] = useState({
        zaplanowane: [],
        odbyte: [],
        anulowane: [], // Dodajemy nową sekcję dla anulowanych wizyt
    });
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [editedOpis, setEditedOpis] = useState('');
    const [editOpisId, setEditOpisId] = useState(null);
    const [newDateTime, setNewDateTime] = useState('');
    const [selectedWizytaId, setSelectedWizytaId] = useState(null);
    const [isDateSelectorOpen, setDateSelectorOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState('');



    useEffect(() => {
        const fetchMojeWizyty = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/wizyty/${userData.id}/pacjent/`);
                const { zaplanowane, odbyte, anulowane } = response.data;
                setMojeWizyty({ zaplanowane, odbyte, anulowane });
            } catch (error) {
                console.error('Błąd podczas pobierania wizyt:', error);
            }
        };

        fetchMojeWizyty();
    }, [userData.id]);

    const handleAnulujWizyte = async (wizytaId) => {
        const confirmed = window.confirm('Czy na pewno chcesz anulować wizytę?');

        if (!confirmed) {
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/wizyty/${wizytaId}/anuluj/`);

            setMojeWizyty((prevState) => {
              const updatedZaplanowane = prevState.zaplanowane.map((w) =>
                w.id === wizytaId ? { ...w, status: 'Anulowana' } : w
              );
              return { ...prevState, zaplanowane: updatedZaplanowane };
            });
        window.location.reload();
        } catch (error) {
            console.error('Błąd podczas anulowania wizyty:', error);
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
        // Ustawienie początkowych danych do edycji
        setEditedData({
            imie: userData.imie,
            nazwisko: userData.nazwisko,
            data_urodzenia: userData.data_urodzenia,
            adres: userData.adres,
            pesel: userData.pesel,
            inne_informacje: userData.inne_informacje,
        });
        setValidationErrors({});
    };

    const handleInputChange = (e) => {
        // Obsługa zmian w formularzu edycji
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
        setValidationErrors({ ...validationErrors, [e.target.name]: '' });

    };

    const validateData = (data) => {
        const errors = {};

        // Walidacja imienia
        if (!data.imie || !/^[a-zA-Z]+$/.test(data.imie)) {
            errors.imie = 'Imię musi być tekstem.';
        }

        // Walidacja nazwiska
        if (!data.nazwisko || !/^[a-zA-Z]+$/.test(data.nazwisko)) {
            errors.nazwisko = 'Nazwisko musi być tekstem.';
        }

        // Walidacja daty urodzenia
        if (!data.data_urodzenia || !/^\d{4}-\d{2}-\d{2}$/.test(data.data_urodzenia)) {
            errors.data_urodzenia = 'Nieprawidłowy format daty urodzenia. Użyj YYYY-MM-DD.';
        }

        // Walidacja PESEL
        if (!data.pesel || !/^\d{11}$/.test(data.pesel)) {
            errors.pesel = 'PESEL musi mieć 11 cyfr.';
        }

        // ... (inne walidacje)

        return errors;
    };

    const handleSaveChanges = async () => {
    try {
        // Walidacja danych
        const errors = validateData(editedData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        // Sprawdzenie, czy PESEL został zmieniony
        if (editedData.pesel !== userData.pesel) {
            // Sprawdzenie, czy nowy PESEL już istnieje w bazie danych
            const isPeselExists = await checkPeselExistence(editedData.pesel);
            if (isPeselExists) {
                setValidationErrors({ pesel: 'PESEL już istnieje w bazie danych.' });
                return;
            }
        }

        await axios.put(`http://localhost:8000/api/pacjenci/${userData.id}/`, editedData);
        setEditMode(false);
        window.location.reload()
    } catch (error) {
        console.error('Błąd podczas zapisywania zmian:', error);
    }
};

    const checkPeselExistence = async (pesel) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/check_pesel/${pesel}/`);
            return response.data.exists;
        } catch (error) {
            console.error('Błąd podczas sprawdzania PESEL w bazie danych:', error);
            return false;
        }
    };

    const handleEditOpis = (wizytaId, opis) => {
        setEditOpisId(wizytaId);
        setEditedOpis(opis);
    };

    const handleSaveOpis = async (wizytaId) => {
    try {
        await axios.put(`http://localhost:8000/api/wizyty/${wizytaId}/edytuj-opis/`, { opis: editedOpis });

        // Aktualizacja stanu, aby odzwierciedlić zmiany w opisie wizyty
        setMojeWizyty((prevState) => {
            const updatedZaplanowane = prevState.zaplanowane.map((w) =>
                w.id === wizytaId ? { ...w, opis: editedOpis } : w
            );
            return { ...prevState, zaplanowane: updatedZaplanowane };
        });

        // Zakończ edycję
        setEditOpisId(null);
        setEditedOpis('');
    } catch (error) {
        console.error('Błąd podczas zapisywania zmian w opisie wizyty:', error);
    }
};



    return (
        <div>
            <StyledDoctorInfoContainer>
                <Typography variant="h5">Panel Pacjenta</Typography>
                <p>Imię: {userData.imie}</p>
                <p>Nazwisko: {userData.nazwisko}</p>
                <p>Data urodzenia: {userData.data_urodzenia}</p>
                <p>Adres: {userData.adres}</p>
                <p>Pesel: {userData.pesel}</p>
                <p>Inne informacje: {userData.inne_informacje}</p>

                {!editMode ? (
                    <StyledButton onClick={handleEditClick}>Edytuj dane</StyledButton>
                ) : (
                    <div>
                        <label>
                            Imię:
                            <StyledWizytaTextarea name="imie" value={editedData.imie} onChange={handleInputChange} />
                        </label>
                        <label>
                            Nazwisko:
                            <StyledWizytaTextarea name="nazwisko" value={editedData.nazwisko} onChange={handleInputChange} />
                        </label>
                        <label>
                            Data urodzenia:
                            <StyledWizytaTextarea
                                type="text"
                                name="data_urodzenia"
                                value={editedData.data_urodzenia}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Adres:
                            <StyledWizytaTextarea type="text" name="adres" value={editedData.adres} onChange={handleInputChange} />
                        </label>
                        <label>
                            Pesel:
                            <StyledWizytaTextarea type="text" name="pesel" value={editedData.pesel} onChange={handleInputChange} />
                        </label>
                        <label>
                            Inne informacje:
                            <StyledWizytaTextarea
                                type="text"
                                name="inne_informacje"
                                value={editedData.inne_informacje}
                                onChange={handleInputChange}
                            />
                            <div style={{ color: 'red' }}>
                                {validationErrors.imie && <p>{validationErrors.imie}</p>}
                                {validationErrors.nazwisko && <p>{validationErrors.nazwisko}</p>}
                                {validationErrors.data_urodzenia && <p>{validationErrors.data_urodzenia}</p>}
                                {validationErrors.pesel && <p>{validationErrors.pesel}</p>}
                            </div>
                        </label>
                        <StyledButton onClick={handleSaveChanges}>Zapisz zmiany</StyledButton>
                    </div>
                )}
            </StyledDoctorInfoContainer>

            <StyledAppointment>
                <Typography variant="h6">Moje wizyty:</Typography>
                <StyledAppointment>
                    <Typography variant="subtitle1">Zaplanowane:</Typography>
                    {mojeWizyty.zaplanowane.length === 0 ? (
                        <p>Brak zaplanowanych wizyt.</p>
                    ) : (
                        <ul>
                            {mojeWizyty.zaplanowane.map(wizyta => (
                            <StyledAppointment key={wizyta.id}>
                                Data wizyty: {new Date(wizyta.data_i_godzina).toLocaleString()} | Lekarz: {wizyta.lekarz?.imie} {wizyta.lekarz?.nazwisko} | Specjalizacja lekarza: {wizyta.lekarz?.specjalizacja}
                                <br />
                                Opis pacjenta: {editOpisId === wizyta.id ? (
                                    <div>
                                        <input type="text" value={editedOpis} onChange={(e) => setEditedOpis(e.target.value)} />
                                        <StyledButton onClick={() => handleSaveOpis(wizyta.id)}>Zapisz</StyledButton>
                                    </div>
                                ) : (
                                    <span>{wizyta.opis || 'Brak danych o opis:'}</span>
                                )}
                                {editOpisId !== wizyta.id && (
                                        <StyledButtons>
                                        <StyledButton3 variant="contained" onClick={() => handleEditOpis(wizyta.id, wizyta.opis)}>
                                        Edytuj opis
                                        </StyledButton3>
                                        </StyledButtons>
                                    )}
                                <br />
                                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                                {wizyta.status === 'Anulowana' ? <span style={{ color: 'red' }}>Wizyta anulowana</span> : null}
                                <StyledButtons>
                                <StyledButton3 variant="contained" onClick={() => handleAnulujWizyte(wizyta.id)}>
                                Anuluj wizytę
                                </StyledButton3>
                                </StyledButtons>

                            </StyledAppointment>
                            ))}
                        </ul>
                    )}
                </StyledAppointment>
                <StyledAppointment>
                    <Typography variant="subtitle1">Odbyte:</Typography>
                    {mojeWizyty.odbyte.length === 0 ? (
                        <p>Brak odbytych wizyt.</p>
                    ) : (
                        <ul>
                            {mojeWizyty.odbyte.map(wizyta => (
                            <StyledAppointment key={wizyta.id}>
                                Data wizyty: {new Date(wizyta.data_i_godzina).toLocaleString()} | Lekarz: {wizyta.lekarz?.imie} {wizyta.lekarz?.nazwisko} | Specjalizacja lekarza: {wizyta.lekarz?.specjalizacja}
                                <br />
                                Opis pacjenta: {wizyta.opis || 'Brak danych o opis:'}
                                <br />
                                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                                <br />
                                Diagnoza: {wizyta.diagnoza || 'Brak diagnozy'}
                                <br />
                                Przepisane leki: {wizyta.przepisane_leki || 'Brak przepisanych leków'}
                                <br />
                                Notatki lekarza: {wizyta.notatki_lekarza || 'Brak notatek lekarza'}
                            </StyledAppointment>
                            ))}
                        </ul>
                    )}
                </StyledAppointment>
                <StyledAppointment>
                    <Typography variant="subtitle1">Anulowane:</Typography>
                    {mojeWizyty.anulowane.length === 0 ? (
                        <p>Brak anulowanych wizyt.</p>
                    ) : (
                        <ul>
                            {mojeWizyty.anulowane.map(wizyta => (
                            <StyledAppointment key={wizyta.id}>
                                Data wizyty: {new Date(wizyta.data_i_godzina).toLocaleString()} | Lekarz: {wizyta.lekarz?.imie} {wizyta.lekarz?.nazwisko} | Specjalizacja lekarza: {wizyta.lekarz?.specjalizacja}
                                <br />
                                Opis pacjenta: {wizyta.opis || 'Brak danych o opis:'}
                                <br />
                                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                                <br />
                            </StyledAppointment>
                            ))}
                        </ul>
                    )}
                </StyledAppointment>
            </StyledAppointment>
        </div>
    );
};

export default PatientPanel;