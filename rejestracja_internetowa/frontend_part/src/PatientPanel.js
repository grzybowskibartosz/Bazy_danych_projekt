import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Calendar from 'react-calendar';
import { useParams } from 'react-router-dom';

import logo from './logo.png';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';


const PatientPanel = ({ userData }) => {
    const [mojeWizyty, setMojeWizyty] = useState([]);

    useEffect(() => {
        const fetchMojeWizyty = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/wizyty/${userData.id}/pacjent/`);
                setMojeWizyty(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania wizyt:', error);
            }
        };

        fetchMojeWizyty();
    }, [userData.id]); // [] sprawia, że useEffect zostanie wykonany tylko raz, po zamontowaniu komponentu





    return (
        <div>
            <Typography variant="h5">Panel Pacjenta</Typography>
            <p>Imię: {userData.imie}</p>
            <p>Nazwisko: {userData.nazwisko}</p>
            <p>Data urodzenia: {userData.data_urodzenia}</p>
            <p>Adres: {userData.adres}</p>
            <p>Pesel: {userData.pesel}</p>
            <p>Inne informacje: {userData.inne_informacje}</p>

            <Typography variant="h6">Moje wizyty:</Typography>
            <ul>
                {mojeWizyty.map(wizyta => (
                    <li key={wizyta.id}>
                        {wizyta.opis} - {new Date(wizyta.data_i_godzina).toLocaleString()} | Lekarz: {wizyta.lekarz.imie} {wizyta.lekarz.nazwisko} | {wizyta.lekarz.specjalizacja}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientPanel;
