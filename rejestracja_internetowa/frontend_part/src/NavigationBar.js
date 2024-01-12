import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
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
});

const StyledLogo = styled('img')({
  height: '70px',
  margin: '10px 0',
});

const NavigationBar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');

  const handleLogout = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        console.log('Pobrany token:', authToken);

        await axios.post('http://localhost:8000/api/logout/', null, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        localStorage.removeItem('authToken');

        window.location.reload();

      } catch (error) {
        console.error('Error during logout:', error);
      }
  };

  useEffect(() => {
    // Dodaj kod do sprawdzania, czy użytkownik jest zalogowany (np. za pomocą tokenów)
    // i pobierania informacji o użytkowniku, jeśli jest zalogowany
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
          setUserName(userInfo.user_data.imie);
          setRole(userInfo.role)
        } else {
          setLoggedIn(false);
          setUserName('');
        }
      } catch (error) {
        console.error('Błąd sprawdzania statusu logowania:', error);
        setLoggedIn(false);
        setUserName('');
      }
    };

    checkLoginStatus();
  }, []); // Pusta tablica oznacza, że useEffect będzie wywołane tylko raz, po zamontowaniu komponentu

  return (
  <StyledAppBar position="static">
    <StyledToolbar>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledLogo src={logo} alt="PolwroMED Logo" />
        <Typography variant="h6" style={{ marginLeft: 10 }}>
          PolwroMED
        </Typography>
        {loggedIn && (
          <Typography variant="h6" style={{ marginLeft: 10 }}>
            | Witaj, {userName}!
          </Typography>
        )}
      </div>
      {!loggedIn ? (
        <StyledButtonsContainer>
          <Button color="inherit" component={Link} to="/">
            Strona główna
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Logowanie
          </Button>
          <Button color="inherit" component={Link} to="/rejestracja">
            Rejestracja
          </Button>
          <Button color="inherit" component={Link} to="/nasi-lekarze">
            Nasi lekarze
          </Button>
        </StyledButtonsContainer>
      ) : (
        <StyledButtonsContainer>
          <Button color="inherit" onClick={handleLogout}>
            Wyloguj
          </Button>
          <Button color="inherit" component={Link} to="/">
            Strona główna
          </Button>
          <Button color="inherit" component={Link} to="/nasi-lekarze">
            Nasi lekarze
          </Button>
          {role === "patient" ? (
            <Button color="inherit" component={Link} to="/login">
              Panel pacjenta
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Panel lekarza
            </Button>
          )}
        </StyledButtonsContainer>
      )}
    </StyledToolbar>
  </StyledAppBar>
);

};
export default NavigationBar;
