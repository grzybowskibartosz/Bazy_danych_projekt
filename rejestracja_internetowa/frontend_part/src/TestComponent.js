// TestComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/posts/');
        console.log(response.data);  // Sprawdź, czy dane są poprawne
        setData(response.data.posts);  // Ustaw tylko część "posts" danych
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Testowy Komponent React</h1>
      {data ? (
        <ul>
          {/* Przeiteruj przez tablicę postów i wyświetl ich tytuły i treść */}
          {data.map(post => (
            <li key={post.title}>
              <strong>{post.title}</strong>: {post.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>Ładowanie danych...</p>
      )}
    </div>
  );
};

export default TestComponent;
