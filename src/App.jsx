import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file for styles

const Weather = ({
  temperature,
  description,
  city,
  icon,
  humidity,
  windSpeed,
  windGust,
  windDeg,
  pressure,
  feelsLike,
  tempMin,
  tempMax,
  rain,
  snow,
  sunrise,
  sunset,
  visibility,
  clouds,
  lat,
  lon,
}) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <div className="weather-container">
      <h2 className="city">{city}</h2>
      <p className="coords">
        Lat: {lat}, Lon: {lon}
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
        className="icon"
      />
      <p className="temperature">{Math.round(temperature - 273.15)}°C</p>
      <p className="description">{description}</p>
      <p className="detail">Feels Like: {Math.round(feelsLike - 273.15)}°C</p>
      <p className="detail">Min Temp: {Math.round(tempMin - 273.15)}°C</p>
      <p className="detail">Max Temp: {Math.round(tempMax - 273.15)}°C</p>
      <p className="detail">Humidity: {humidity}%</p>
      <p className="detail">Wind Speed: {windSpeed} m/s</p>
      <p className="detail">Wind Gust: {windGust} m/s</p>
      <p className="detail">Wind Direction: {windDeg}°</p>
      <p className="detail">Pressure: {pressure} hPa</p>
      {rain !== undefined && <p className="detail">Rain (1h): {rain} mm</p>}
      {snow !== undefined && <p className="detail">Snow (1h): {snow} mm</p>}
      <p className="detail">Visibility: {visibility} m</p>
      <p className="detail">Cloudiness: {clouds}%</p>
      <p className="detail">Sunrise: {formatTime(sunrise)}</p>
      <p className="detail">Sunset: {formatTime(sunset)}</p>
    </div>
  );
};

const App = () => {
  const API_KEY = import.meta.env.VITE_API_KEY; // Access the API key from the environment variable
  const districts = [
    { name: "Yogyakarta", lat: -7.7956, lon: 110.3695 },
    { name: "Sleman", lat: -7.715298, lon: 110.355308 },
    { name: "Bantul", lat: -7.922842, lon: 110.328535 },
    { name: "Gunungkidul", lat: -8.027008, lon: 110.616875 },
    { name: "Kulon Progo", lat: -7.828017, lon: 110.157096 },
  ];
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchWeather = async (lat, lon, city) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const data = response.data;
      const weatherInfo = {
        temperature: data.main.temp,
        description: data.weather[0].description,
        city: city,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        windGust: data.wind.gust,
        windDeg: data.wind.deg,
        pressure: data.main.pressure,
        feelsLike: data.main.feels_like,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        rain: data.rain ? data.rain["1h"] : undefined,
        snow: data.snow ? data.snow["1h"] : undefined,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        visibility: data.visibility,
        clouds: data.clouds.all,
        lat: data.coord.lat,
        lon: data.coord.lon,
      };
      setWeatherData(weatherInfo);
    } catch (err) {
      setError("Could not fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { lat, lon, name } = districts[currentIndex];
    fetchWeather(lat, lon, name);

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % districts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    const { lat, lon, name } = districts[currentIndex];
    fetchWeather(lat, lon, name);
  }, [currentIndex]);

  return (
    <div className="app">
      <div className="container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          weatherData && <Weather {...weatherData} />
        )}
      </div>
    </div>
  );
};

export default App;
