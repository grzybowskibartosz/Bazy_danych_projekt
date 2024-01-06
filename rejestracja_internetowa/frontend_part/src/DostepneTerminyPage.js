import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DostepneTerminyPage = ({ match }) => {
  const lekarzId = match.params.lekarzId;
  const [dostepneTerminy, setDostepneTerminy] = useState([]);

  useEffect(() => {
    // Pobierz dostępne terminy danego lekarza z API
    axios.get(`http://localhost:8000/api/dostepne-terminy/${lekarzId}`)
      .then(response => setDostepneTerminy(response.data))
      .catch(error => console.error('Błąd pobierania dostępnych terminów:', error));
  }, [lekarzId]);

  return (
    <div>
      <h2>Dostępne terminy dla lekarza o ID: {lekarzId}</h2>
      {/* Wyświetl dostępne terminy */}
      <ul>
        {dostepneTerminy.map(termin => (
          <li key={termin.id}>{termin.data_i_godzina}</li>
        ))}
      </ul>
    </div>
  );
};

export default DostepneTerminyPage;
