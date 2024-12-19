import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Recuerdos from './pages/Recuerdos';
import './App.css';

function App() {
  const [timeToChristmas, setTimeToChristmas] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [timeToNewYear, setTimeToNewYear] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const christmas = new Date(now.getFullYear(), 11, 24, 0, 0, 0); // Navidad
      const newYear = new Date(now.getFullYear(), 11, 31, 0, 0, 0); // Año Nuevo

      const updateCountdown = (targetDate) => {
        const timeDifference = targetDate - now;

        const seconds = Math.floor((timeDifference / 1000) % 60);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        return { days, hours, minutes, seconds };
      };

      setTimeToChristmas(updateCountdown(christmas));
      setTimeToNewYear(updateCountdown(newYear));
    };

    calculateTimeLeft(); // Calcula la cuenta regresiva inmediatamente

    const interval = setInterval(() => {
      calculateTimeLeft(); // Actualiza cada segundo
    }, 1000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <Router>
      <div className="App">
        <header>
          <h1>¡Bienvenidos a la página familiar!</h1>
          <p>Planeemos juntos los momentos especiales de fin de año: 24 y 31 de diciembre.</p>
          <Link to="/recuerdos" className="memories-button">
            📸 Añadir Recuerdos
          </Link>
        </header>

        <Routes>
          <Route path="/" element={
            <>
              <main>
                <section>
                  <h2>Plan para el 24 de diciembre</h2>
                  <p>🎄 Cena navideña, intercambio de regalos y juegos en familia.</p>
                </section>
                <section>
                  <h2>Plan para el 31 de diciembre</h2>
                  <p>🎆 Fiesta de año nuevo, música, baile y rituales para atraer lo mejor del próximo año.</p>
                </section>
                <section>
                  <h2>Navidad 🎄</h2>
                  <p>
                    Faltan <strong>{timeToChristmas.days}</strong> días,{" "}
                    <strong>{timeToChristmas.hours}</strong> horas,{" "}
                    <strong>{timeToChristmas.minutes}</strong> minutos y{" "}
                    <strong>{timeToChristmas.seconds}</strong> segundos.
                  </p>
                </section>
                <section>
                  <h2>Año Nuevo 🎆</h2>
                  <p>
                    Faltan <strong>{timeToNewYear.days}</strong> días,{" "}
                    <strong>{timeToNewYear.hours}</strong> horas,{" "}
                    <strong>{timeToNewYear.minutes}</strong> minutos y{" "}
                    <strong>{timeToNewYear.seconds}</strong> segundos.
                  </p>
                </section>
              </main>
            </>
          } />
          <Route path="/recuerdos" element={<Recuerdos />} />
        </Routes>

        <footer>
          <p>❤️ Con amor, para toda nuestra familia.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
