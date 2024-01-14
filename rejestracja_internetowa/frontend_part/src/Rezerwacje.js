import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Rezerwacje = () => {
  const [pacjent, setPacjent] = useState({});
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [lekarz, setLekarz] = useState({});
  const [gabinet, setGabinet] = useState({});
  const [opisDolegliwosci, setOpisDolegliwosci] = useState(''); // Dodane pole opisu dolegliwości
  const { lekarzId, rok, miesiac, dzien, godzina, minuta } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          // Pobierz informacje o użytkowniku na podstawie tokena
          const response = await axios.get('http://localhost:8000/api/get_user_info/', {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          });
          const userInfo = response.data;

          // Ustaw dane pacjenta
          setPacjent(userInfo.user_data);

          // Ustaw dane lekarza na podstawie parametru lekarzId
          const lekarzResponse = await axios.get(`http://localhost:8000/api/lekarze/${lekarzId}/`);
          setLekarz(lekarzResponse.data);

           const gabinetResponse = await axios.get(`http://localhost:8000/api/lekarze/${lekarzId}/gabinety/`);
           console.log('Dane gabinetu z backendu:', gabinetResponse.data);
           setGabinet(gabinetResponse.data);

          // Zakończ ładowanie
          setLoading(false);
        }
      } catch (error) {
        console.error('Błąd pobierania informacji o użytkowniku:', error);
      }
    };



    fetchData();
  }, [lekarzId]);

    const handleOpisChange = (event) => {
    setOpisDolegliwosci(event.target.value);
  };

  const handleRezerwacjaClick = async () => {
    if (!rok || !miesiac || !dzien || !godzina || !minuta || !lekarzId || !pacjent.id || !opisDolegliwosci) {
    console.error('Wszystkie pola muszą być uzupełnione');
    console.log(gabinet.gabinety[0]);
    console.log(rok, miesiac, dzien, godzina, minuta, lekarzId, pacjent.id, opisDolegliwosci, 1);
    return;
    }
    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        const gabinetId = gabinet.gabinety[0].id;
        const gabinetIds = [gabinetId]
        console.log(gabinet.gabinety[0].id);

        await axios.post('http://localhost:8000/api/rezerwacje/', {
          data_i_godzina: `${rok}-${miesiac}-${dzien} ${godzina}:${minuta}:00`,
          lekarz_id: lekarzId,
          pacjent_id: pacjent.id,
          opis: opisDolegliwosci,
          gabinet_id: gabinetId,
        },{
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        // Przekieruj na stronę potwierdzenia rezerwacji lub inny widok
        // window.location.href = '/potwierdzenie-rezerwacji'; // Dodaj odpowiednią ścieżkę
      }
    } catch (error) {
      console.error('Błąd rezerwacji wizyty:', error);
    }
  };


  if (loading) {
    return <p>Ładowanie danych...</p>;
  }

  return (
    <>
      {pacjent && lekarz && (
        <>
          <h1>Rezerwacja wizyty</h1>
          <h1>Informacje o pacjencie:</h1>
          <p>Imię: {pacjent.imie}</p>
          <p>Nazwisko: {pacjent.nazwisko}</p>
          <p>Data urodzenia: {pacjent.data_urodzenia}</p>
          <p>Adres zamieszkania: {pacjent.adres}</p>
          <p>PESEL: {pacjent.pesel}</p>
          <p>Inne informacje: {pacjent.inne_informacje}</p>

          <h1>Informacje o wybranym lekarzu:</h1>
          <p>Imię lekarza: {lekarz.imie}</p>
          <p>Nazwisko lekarza: {lekarz.nazwisko}</p>
          <p>Specjalizacja: {lekarz.specjalizacja}</p>
          <p>Gabinet: {gabinet.gabinety[0].numer_gabinetu}</p>
          {gabinet.gabinety.length > 0 ? (
  <>
    <h1>Informacje o gabinetach lekarza:</h1>
    <ul>
      {gabinet.gabinety.map((gabinetInfo) => (
        <li key={gabinetInfo.id}>
          Numer gabinetu: {gabinetInfo.numer_gabinetu}
          <br />
          Specjalizacja: {gabinetInfo.specjalizacja}
          <br />
          Opis gabinetu: {gabinetInfo.opis_gabinetu}
          <br />
          Status dostępności: {gabinetInfo.status_dostepnosci ? 'Dostępny' : 'Niedostępny'}
          <br />
          {/* Dodaj więcej pól, jeśli są dostępne */}
        </li>
      ))}
    </ul>
  </>
) : (
  <p>Brak dostępnych gabinetów.</p>
)}

          <h1>Wybrany termin rezerwacji:</h1>
          <p>Data: {rok}-{miesiac}-{dzien}</p>
          <p>Godzina: {godzina}:{minuta}</p>

          <textarea
            rows="4"
            cols="50"
            placeholder="Opis dolegliwości"
            value={opisDolegliwosci}
            onChange={handleOpisChange}
          />
          <button onClick={handleRezerwacjaClick}>Zarezerwuj wizytę</button>
        </>
      )}
    </>
  );
};

export default Rezerwacje;
