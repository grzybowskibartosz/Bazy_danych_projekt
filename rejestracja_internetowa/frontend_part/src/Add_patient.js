import React, { useState } from 'react';
import Axios from 'axios';

const DodajPacjenta = () => {
    const [pacjent, setPacjent] = useState({
        imie: '',
        nazwisko: '',
        pesel: '',
        // ... different fields
    });

    const handleInputChange = (e) => {
        setPacjent({ ...pacjent, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post('http://localhost:8000/api/Add_patient/', pacjent);
            console.log(response.data);  // Możesz obsługiwać odpowiedź API tutaj
        } catch (error) {
            console.error('Błąd podczas wysyłania danych:', error);
        }
    };

    return (
        <div>
            <h2>Dodaj Pacjenta</h2>
            <form onSubmit={handleSubmit}>
                <label>Imię:</label>
                <input type="text" name="imie" value={pacjent.imie} onChange={handleInputChange} />
                <label>Nazwisko:</label>
                <input type="text" name="Nazwisko" value={pacjent.nazwisko} onChange={handleInputChange} />
                <input type="text" name="PESEL" value={pacjent.pesel} onChange={handleInputChange} />

                <button type="submit">Dodaj Pacjenta</button>
            </form>
        </div>
    );
};

export default DodajPacjenta;
