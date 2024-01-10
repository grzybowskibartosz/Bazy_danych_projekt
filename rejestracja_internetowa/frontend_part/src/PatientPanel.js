import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const PatientPanel = ({ userData }) => {
    const [mojeWizyty, setMojeWizyty] = useState({ zaplanowane: [], odbyte: [] });

    useEffect(() => {
        const fetchMojeWizyty = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/wizyty/${userData.id}/pacjent/`);
                const { zaplanowane, odbyte } = response.data;
                setMojeWizyty({ zaplanowane, odbyte });
            } catch (error) {
                console.error('Błąd podczas pobierania wizyt:', error);
            }
        };

        fetchMojeWizyty();
    }, [userData.id]);

    return (
        <div>
            <Typography variant="h5">Panel Pacjenta</Typography>
            <p>Imię: {userData.imie}</p>
            <p>Nazwisko: {userData.nazwisko}</p>
            <p>Data urodzenia: {userData.data_urodzenia}</p>
            <p>Adres: {userData.adres}</p>
            <p>Pesel: {userData.pesel}</p>
            <p>Inne informacje: {userData.inne_informacje}</p>

            <div>
                <Typography variant="h6">Moje wizyty:</Typography>
                <div>
                    <Typography variant="subtitle1">Zaplanowane:</Typography>
                    <ul>
                        {mojeWizyty.zaplanowane.map(wizyta => (
                            <li key={wizyta.id}>
                                {wizyta.opis} - {new Date(wizyta.data_i_godzina).toLocaleString()} | Lekarz: {wizyta.lekarz?.imie} {wizyta.lekarz?.nazwisko} | {wizyta.lekarz?.specjalizacja}
                                <br />
                                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                                <br />
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <Typography variant="subtitle1">Odbyte:</Typography>
                    <ul>
                        {mojeWizyty.odbyte.map(wizyta => (
                            <li key={wizyta.id}>
                                {wizyta.opis} - {new Date(wizyta.data_i_godzina).toLocaleString()} | Lekarz: {wizyta.lekarz?.imie} {wizyta.lekarz?.nazwisko} | {wizyta.lekarz?.specjalizacja}
                                <br />
                                Gabinet: {wizyta.gabinet || 'Brak danych o gabinecie'}
                                <br />
                                Diagnoza: {wizyta.diagnoza || 'Brak diagnozy'}
                                <br />
                                Przepisane leki: {wizyta.przepisane_leki || 'Brak przepisanych leków'}
                                <br />
                                Notatki lekarza: {wizyta.notatki_lekarza || 'Brak notatek lekarza'}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatientPanel;
