import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [time, setTime] = useState({});
  const [geo, setGeo] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);

  // Función para convertir el número del día de la semana en nombre
  const getDayName = (dayNumber) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayNumber];
  };

  useEffect(() => {
    // Obtener geolocalización
    fetch('https://geolocation-db.com/json/')
      .then(response => response.json())
      .then(data => {
        setGeo(data);
        return fetch('https://worldtimeapi.org/api/ip');
      })
      .then(response => response.json())
      .then(data => {
        setTime({
          datetime: new Date(data.datetime),
          dayOfWeek: data.day_of_week,
          dayOfYear: data.day_of_year,
        });
        // Configurar modo oscuro/claro
        const hours = new Date(data.datetime).getHours();
        setDarkMode(hours >= 18 || hours < 6);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch data');
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => ({
        ...prevTime,
        datetime: new Date(prevTime.datetime.getTime() + 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const { datetime, dayOfWeek, dayOfYear } = time;

  if (error) {
    return <div className="clock-container error">{error}</div>;
  }

  return (
    <div className="clock-container">
      <h1>Hora actual: {datetime && datetime.toLocaleTimeString()}</h1>
      <p>Día de la semana: {dayOfWeek !== undefined && getDayName(dayOfWeek)}</p>
      <p>Día del año: {dayOfYear}</p>
    </div>
  );
};

export default App;
