import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

import NavigationBar from './NavigationBar';
import Pacjent from './PatientPanel';
import Lekarz from './DoctorPanel';
import logo from './logo.png';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#26a197',
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledButtonsContainer = styled('div')({
  display: 'flex',
  gap: '10px',
  marginLeft: 'auto',
});

const StyledCenteredColumn = styled('div')({
  backgroundColor: '#e0e0e0',
  width: '50%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100vh',
});

const StyledFormContainer = styled('div')({
  width: '50%',
  margin: '0 auto',
  marginTop: '50px',
});

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const StyledButton = styled(Button)({
  marginTop: '16px',
  backgroundColor: '#26a197',
});

const StyledLogo = styled('img')({
  height: '70px',
  margin: '10px 0',
});

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [userInfo, setUserInfo] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', loginData);
      const token = response.data.token;

      localStorage.setItem('authToken', token);

      console.log('Zalogowano:', token);

      setLoggedIn(true);

      getUserInfo();

      window.location.reload();


    } catch (error) {
      console.error('Błąd logowania:', error);
      setLoggedIn(false);
    }
  };

  const handleLogout = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    console.log('Pobrany token:', authToken);

    const response = await axios.post('http://localhost:8000/api/logout/', null, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });

    // Pomyślne wylogowanie - usuń token z pamięci lokalnej
    localStorage.removeItem('authToken');

    window.location.reload();


    // Przekierowanie lub aktualizacja interfejsu użytkownika
  } catch (error) {
    // Obsługa błędów, np. brak autoryzacji
    console.error('Error during logout:', error);
  }
};

  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.get('http://localhost:8000/api/get_user_info/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const userInfo = response.data;

      console.log(userInfo);


    } catch (error) {
      console.error('Błąd pobierania informacji o użytkowniku:', error);
    }
  };

  useEffect(() => {
    // Sprawdź, czy użytkownik jest zalogowany (np. za pomocą tokenów)
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://localhost:8000/api/get_user_info/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          const userInfo = response.data;
          setLoggedIn(true);
          setUserInfo(userInfo);
        } else {
          setLoggedIn(false);
          setUserInfo({});
        }
      } catch (error) {
        console.error('Błąd sprawdzania statusu logowania:', error);
        setLoggedIn(false);
        setUserInfo({});
      }
    };

    checkLoginStatus();
  }, []); // Pusta tablica oznacza, że useEffect będzie wywołane tylko raz, po zamontowaniu komponentu

  return (
    <>
      <NavigationBar />
      <StyledFormContainer>
        {loggedIn ? (
          <div>
            <Typography variant="h5">Jesteś zalogowany</Typography>
            {userInfo.role === 'patient' && <Pacjent userData={userInfo.user_data} />}
            {userInfo.role === 'doctor' && <Lekarz userData={userInfo.user_data} />}
            <Button variant="contained" color="secondary" onClick={handleLogout} >
              Wyloguj
            </Button>
          </div>
        ) : (
          <div>
            <Typography variant="h5">Panel Logowania</Typography>
            <StyledForm>
              <TextField
                label="Nazwa użytkownika"
                name="username"
                value={loginData.username}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Hasło"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                variant="outlined"
                type="password"
              />
              {loginError && (
                <Typography variant="body2" color="error">
                  {loginError}
                </Typography>
              )}
              <StyledButton variant="contained" color="primary" onClick={handleLogin}>
                Zaloguj
              </StyledButton>
              <Link to="/">Przejdź do strony głównej</Link>
            </StyledForm>
          </div>
        )}
      </StyledFormContainer>
    </>
  );
};

export default Login;
