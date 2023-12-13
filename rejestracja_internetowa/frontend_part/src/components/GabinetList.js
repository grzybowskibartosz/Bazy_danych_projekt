// /src/components/GabinetList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GabinetList = () => {
  const [gabinety, setGabinety] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/gabinety/');
        setGabinety(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Lista Gabinetów</h2>
      <ul>
        {gabinety.map(gabinet => (
          <li key={gabinet.id}>{gabinet.numer_gabinetu} - {gabinet.specjalizacja}</li>
        ))}
      </ul>
    </div>
  );
};

export default GabinetList;
