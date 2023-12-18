import React, { useState } from 'react';
import axios from 'axios';

const Rejestracja = () => {
  const [etapRejestracji, setEtapRejestracji] = useState(1);
  const [nowyPacjent, setNowyPacjent] = useState({
    imie: '',
    nazwisko: '',
    pesel: '',
    data_urodzenia: '',
    adres: '',
    email: '',
    haslo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNowyPacjent((prevPacjent) => ({
      ...prevPacjent,
      [name]: value,
    }));
  };

  const zarejestrujPacjenta = () => {
    axios.post('http://localhost:8000/api/rejestracja/', nowyPacjent)
      .then(response => {
        console.log("Pacjent zarejestrowany:", response.data);
        // Przekieruj użytkownika na stronę logowania lub potwierdzenia rejestracji
        setEtapRejestracji(2);
      })
      .catch(error => console.error('Błąd rejestracji pacjenta:', error));
  };

  const renderujEtapRejestracji = () => {
    switch (etapRejestracji) {
      case 1:
        return (
          <div>
            <h2>Rejestracja Pacjenta - Etap 1</h2>
            <form>
              <label>
                Imię:
                <input type="text" name="imie" value={nowyPacjent.imie} onChange={handleInputChange} />
              </label>
              <label>
                Nazwisko:
                <input type="text" name="nazwisko" value={nowyPacjent.nazwisko} onChange={handleInputChange} />
              </label>
              <label>
                PESEL:
                <input type="text" name="pesel" value={nowyPacjent.pesel} onChange={handleInputChange} />
              </label>
              <label>
                Data Urodzenia:
                <input type="text" name="data_urodzenia" value={nowyPacjent.data_urodzenia} onChange={handleInputChange} />
              </label>
              <label>
                Adres:
                <input type="text" name="adres" value={nowyPacjent.adres} onChange={handleInputChange} />
              </label>
              <label>
                E-mail:
                <input type="email" name="email" value={nowyPacjent.email} onChange={handleInputChange} />
              </label>
              <label>
                Hasło:
                <input type="password" name="haslo" value={nowyPacjent.haslo} onChange={handleInputChange} />
              </label>
              <button type="button" onClick={zarejestrujPacjenta}>Zarejestruj Pacjenta</button>
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Rejestracja Pacjenta - Potwierdzenie</h2>
            <p>Dziękujemy za rejestrację!</p>
            {/* Możesz dodać przycisk do przekierowania na stronę logowania */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderujEtapRejestracji()}
    </div>
  );
};

export default Rejestracja;
