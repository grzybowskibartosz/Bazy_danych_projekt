// DoctorPanel.js

import React from 'react';
import Typography from '@mui/material/Typography';

const DoctorPanel = ({ userData }) => {
  return (
    <div>
      <Typography variant="h5">Panel Lekarza</Typography>
      <p>Imię: {userData.imie}</p>
      {/* Dodaj więcej pól w zależności od danych lekarza */}
    </div>
  );
};

export default DoctorPanel;
