// /src/components/PacjentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PacjentList = () => {
  const [pacjenci, setPacjenci] = useState([]);
  const [nowyPacjent, setNowyPacjent] = useState({
    imie: '',
    nazwisko: '',
    pesel: '',
    data_urodzenia: '',
    adres: '',
    inne_informacje: '',
  });

  useEffect(() => {
    fetchPacjenci();
  }, []);

  const fetchPacjenci = () => {
    axios.get('http://localhost:8000/api/pacjenci/')
      .then(response => setPacjenci(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNowyPacjent(prevPacjent => ({
      ...prevPacjent,
      [name]: value,
    }));
  };

  const dodajPacjenta = () => {
    console.log("Nowy Pacjent przed wysłaniem:", nowyPacjent);

    axios.post('http://localhost:8000/api/pacjenci/', nowyPacjent)
      .then(response => {
        console.log("Odpowiedź z serwera po dodaniu pacjenta:", response.data);
        fetchPacjenci();  // Odśwież listę pacjentów po dodaniu nowego
        setNowyPacjent({
          imie: '',
          nazwisko: '',
          pesel: '',
          data_urodzenia: '',
          adres: '',
          inne_informacje: '',
        });
      })
      .catch(error => console.error('Error adding pacjent:', error));
  };

  return (
    <div>
      <h2>Lista Pacjentów</h2>

      {/* Formularz dodawania pacjenta */}
      <div>
        <h3>Dodaj Pacjenta</h3>
        <form>
          <label>Imię:
            <input type="text" name="imie" value={nowyPacjent.imie} onChange={handleInputChange} />
          </label>
          <label>Nazwisko:
            <input type="text" name="nazwisko" value={nowyPacjent.nazwisko} onChange={handleInputChange} />
          </label>
          <label>PESEL:
            <input type="text" name="pesel" value={nowyPacjent.pesel} onChange={handleInputChange} />
          </label>
          <label>Data urodzenia:
            <input type="date" name="data_urodzenia" value={nowyPacjent.data_urodzenia} onChange={handleInputChange} />
          </label>
          <label>Adres:
            <input type="text" name="adres" value={nowyPacjent.adres} onChange={handleInputChange} />
          </label>
          <label>Inne informacje:
            <textarea name="inne_informacje" value={nowyPacjent.inne_informacje} onChange={handleInputChange} />
          </label>
          <button type="button" onClick={dodajPacjenta}>Dodaj Pacjenta</button>
        </form>
      </div>

      {/* Lista istniejących pacjentów */}
      <ul>
        {pacjenci.map(pacjent => (
          <li key={pacjent.id}>{pacjent.imie} {pacjent.nazwisko}</li>
        ))}
      </ul>
    </div>
  );
};

export default PacjentList;
