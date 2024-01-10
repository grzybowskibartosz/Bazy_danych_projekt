import React, {useState, useEffect } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

import Pacjent from './PatientPanel';
import Lekarz from './DoctorPanel';

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

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [userInfo, setUserInfo] = useState({});
  //const [panelComponent, setPanelComponent] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Użyj bardziej ogólnego klucza
    const response = await axios.get('http://localhost:8000/api/get_user_info/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const userInfo = response.data;
    setUserInfo(userInfo);
  } catch (error) {
    console.error('Błąd pobierania informacji o użytkowniku:', error);
  }
};

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/login/', loginData);
    const authToken = response.data.token;

    // Zapisz token w localStorage
    localStorage.setItem('authToken', authToken);

    console.log('Zalogowano:', authToken);
    setLoggedIn(true);
    setLoginError('');
    getUserInfo();
  } catch (error) {
    console.error('Błąd logowania:', error);
    setLoggedIn(false);
    setLoginError('Błąd logowania. Sprawdź poprawność danych.');
  }
};


  const handleLogout = () => {
    setLoggedIn(false);
  };

  useEffect(() => {
    if (loggedIn) {
      getUserInfo();
    }
  }, [loggedIn]);



  return (
    <StyledFormContainer>
      {loggedIn ? (
        <div>
          <Typography variant="h5">Jesteś zalogowany</Typography>
          {userInfo.role === 'patient' && <Pacjent userData={userInfo.user_data} />}
          {userInfo.role === 'doctor' && <Lekarz userData={userInfo.user_data} />}
          <Button variant="contained" color="secondary" onClick={handleLogout}>
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
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleLogin}
            >
              Zaloguj
            </StyledButton>
            <Link to="/">Przejdź do strony głównej</Link>
          </StyledForm>
        </div>
      )}
    </StyledFormContainer>
  );
};

export default Login;
