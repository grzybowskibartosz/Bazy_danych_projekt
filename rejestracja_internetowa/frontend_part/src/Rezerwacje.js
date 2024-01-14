import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import NavigationBar from './NavigationBar'


import {Typography, Button, styled, Dialog, DialogActions,
        DialogContent, DialogContentText, DialogTitle, Paper, Container, TextField} from '@material-ui/core';

const CenteredContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const StyledPaper = styled(Paper)({
  padding: '20px',
  marginTop: '20px',
});

const StyledTypography = styled(Typography)({
  marginBottom: '10px',
  textAlign: 'center',
});

const StyledTypography2 = styled(Typography)({
  marginBottom: '5px',
  marginLeft: '350px'
});


const StyledButton = styled(Button)({
  backgroundColor: '#26a197',
  color: '#fff', // Text color
  transition: 'transform 0.3s ease', // Smooth transition on hover
  '&:hover': {
    transform: 'scale(1.05)', // Slightly enlarge on hover
    backgroundColor: '#26a197', // Keep the background color unchanged on hover
    }
});

const Rezerwacje = () => {
	const [pacjent, setPacjent] = useState({});
	const [rezerwacjaZrealizowana, setRezerwacjaZrealizowana] = useState(false);
	const [loading, setLoading] = useState(true);
	const [lekarz, setLekarz] = useState({});
	const [gabinet, setGabinet] = useState({});
	const [opisDolegliwosci, setOpisDolegliwosci] = useState('');
	const [error, setError] = useState('');
	const [errorTermin, setErrorTermin] = useState('');
	const [zajeteTerminy, setZajeteTerminy] = useState([]);
	const { lekarzId, rok, miesiac, dzien, godzina, minuta } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const authToken = localStorage.getItem('authToken');

				if (authToken) {
					const response = await axios.get('http://localhost:8000/api/get_user_info/', {
						headers: {
							Authorization: `Token ${authToken}`,
						},
					});

					setPacjent(response.data.user_data);

					const lekarzResponse = await axios.get(`http://localhost:8000/api/lekarze/${lekarzId}/`);
					setLekarz(lekarzResponse.data);

					const gabinetResponse = await axios.get(`http://localhost:8000/api/lekarze/${lekarzId}/gabinety/`);
					console.log('Dane gabinetu z backendu:', gabinetResponse.data);
					setGabinet(gabinetResponse.data);

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
		try {
			const authToken = localStorage.getItem('authToken');

      const terminDoRezerwacji = new Date(`${rok}-${miesiac}-${dzien} ${godzina}:${minuta}`)

			const zajeteTerminyResponse = await axios.get(`http://localhost:8000/api/zajete-terminy-nowy/${lekarzId}/${rok}/${miesiac}/${dzien}/`);
		  const zajeteTerminy = zajeteTerminyResponse.data.zajete_terminy;
      const terminZajety = zajeteTerminy.some((zajetyTermin) => {
        const dataZajeta = new Date(zajetyTermin);
        console.log('Zajety termin:', dataZajeta);
        console.log('Rezerwowany termin:', terminDoRezerwacji);
        return dataZajeta.getTime() === terminDoRezerwacji.getTime();
      });

      console.log(terminZajety);

      if (!terminZajety) {
          if (authToken) {
            const gabinetId = gabinet.gabinety[0].id;

            await axios.post('http://localhost:8000/api/rezerwacje/', {
              data_i_godzina: `${rok}-${miesiac}-${dzien} ${godzina-1}:${minuta}:00`,
              lekarz_id: lekarzId,
              pacjent_id: pacjent.id,
              opis: opisDolegliwosci,
              gabinet_id: gabinetId,
            }, {
              headers: {
                Authorization: `Token ${authToken}`,
              },
            });

            setRezerwacjaZrealizowana(true);
          }}else{
          setErrorTermin('Termin jest już zarezerwowany');
          }
		} catch (error) {
			console.error('Błąd rezerwacji wizyty:', error);
			setError('Wypełnij pole')
		}
	};

	if (loading) {
		return <p>Ładowanie danych...</p>;
	}

	 return (
    <>
      <NavigationBar />
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <StyledTypography variant="h4">Rezerwacja wizyty</StyledTypography>

          <StyledTypography variant="h6">Informacje o pacjencie:</StyledTypography>
          <StyledTypography2>Imię i nazwisko: {pacjent.imie} {pacjent.nazwisko}</StyledTypography2>
          <StyledTypography2>Data urodzenia: {pacjent.data_urodzenia}</StyledTypography2>
          <StyledTypography2>Adres zamieszkania: {pacjent.adres}</StyledTypography2>
          <StyledTypography2>PESEL: {pacjent.pesel}</StyledTypography2>
          <StyledTypography2>Inne informacje: {pacjent.inne_informacje}</StyledTypography2>

          <StyledTypography variant="h6">Informacje o wybranym lekarzu:</StyledTypography>
          <StyledTypography2>Imię i nazwisko: {lekarz.imie} {lekarz.nazwisko}</StyledTypography2>
          <StyledTypography2>Specjalizacja: {lekarz.specjalizacja}</StyledTypography2>
          <StyledTypography2>Gabinet: {gabinet.gabinety[0].numer_gabinetu}</StyledTypography2>

          <StyledTypography variant="h6">Wybrany termin wizyty:</StyledTypography>
          <StyledTypography2>Data: {dzien}.{miesiac}.{rok}</StyledTypography2>
          <StyledTypography2>Godzina: {godzina}:{minuta}</StyledTypography2>

          <TextField
            multiline
            minRows={4}
            fullWidth
            placeholder="Opisz swoją dolegliwość"
            value={opisDolegliwosci}
            onChange={handleOpisChange}
            margin="normal"
            errror={!!error}
            helperText={error}
            FormHelperTextProps= {{style: {color: '#ff0000'}}}
          />
          <CenteredContainer>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleRezerwacjaClick}
              >
                Zarezerwuj wizytę
              </StyledButton>
          </CenteredContainer>
          <Dialog open={rezerwacjaZrealizowana}>
            <DialogTitle>Rezerwacja zrealizowana</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Wizyta została pomyślnie zarezerwowana!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button  component={Link} to="/login">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        <Dialog open={errorTermin}>
            <DialogTitle>Błąd rezerwacji</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Wizyta została już wcześniej zarezerwowana!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button  component={Link} to="/login">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </StyledPaper>
      </Container>
    </>
  );
};

export default Rezerwacje;
