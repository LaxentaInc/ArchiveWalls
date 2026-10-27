import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Search,
  MapPin,
} from 'lucide-react';
import type { WeatherData, DailyForecast, LocalizedWeather } from '../types';

interface WeatherWidgetProps {
  data: Partial<WeatherData>;
  onUpdate: (data: Partial<WeatherData>) => void;
}

// maps open-meteo wmo weather codes to appropriate visual react icons
function renderWeatherIcon(code: number, className = 'w-4 h-4') {
  if (code === 0) return <Sun className={`${className} text-amber-400`} />;
  if (code <= 2) return <CloudSun className={`${className} text-amber-200`} />;
  if (code === 3 || code === 45 || code === 48)
    return <Cloud className={`${className} text-white/70`} />;
  if (code >= 51 && code <= 67)
    return <CloudRain className={`${className} text-cyan-400`} />;
  if (code >= 71 && code <= 77)
    return <Snowflake className={`${className} text-blue-200`} />;
  if (code >= 80 && code <= 82)
    return <CloudRain className={`${className} text-cyan-300`} />;
  if (code >= 95)
    return <CloudLightning className={`${className} text-purple-400`} />;
  return <Cloud className={`${className} text-white/70`} />;
}

// privacy-respecting weather widget relying on manual city selection
export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data, onUpdate }) => {
  const currentCity = data.city || 'Tokyo';
  const currentLat = data.lat ?? 35.6762;
  const currentLon = data.lon ?? 139.6503;

  const [isSearching, setIsSearching] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [weather, setWeather] = useState<LocalizedWeather>({
    city: currentCity,
    temperature: 20,
    condition: 'Partly cloudy',
    weatherCode: 2,
    windSpeed: 12,
    humidity: 55,
    feelsLike: 20,
    daily: [],
    isLoading: true,
  });

  // fetches current atmospheric parameters and 5-day daily forecast from open-meteo
  useEffect(() => {
    let active = true;

    async function loadForecast() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentLat}&longitude=${currentLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) return;
        const resData = await res.json();
        if (!active) return;

        const current = resData.current;
        const dailyData = resData.daily;
        const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const forecasts: DailyForecast[] = [];

        if (dailyData?.time) {
          for (let i = 0; i < Math.min(5, dailyData.time.length); i++) {
            const date = new Date(dailyData.time[i]);
            forecasts.push({
              day: weekdayNames[date.getDay()],
              maxTemp: Math.round(dailyData.temperature_2m_max[i]),
              minTemp: Math.round(dailyData.temperature_2m_min[i]),
              weatherCode: dailyData.weather_code[i],
            });
          }
        }

        setWeather({
          city: currentCity,
          temperature: Math.round(current.temperature_2m),
          condition: current.weather_code === 0 ? 'Clear sky' : 'Partly cloudy',
          weatherCode: current.weather_code,
          windSpeed: Math.round(current.wind_speed_10m),
          humidity: current.relative_humidity_2m,
          feelsLike: Math.round(current.apparent_temperature),
          daily: forecasts,
          isLoading: false,
        });
      } catch {
        if (active) {
          setWeather((prev) => ({ ...prev, isLoading: false }));
        }
      }
    }

    loadForecast();
    return () => {
      active = false;
    };
  }, [currentCity, currentLat, currentLon]);

  // handles user manual location search via geocoding
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    setSearchError(null);
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityInput.trim()
      )}&count=1&language=en&format=json`;
      const res = await fetch(geoUrl);
      const resData = await res.json();

      if (resData.results && resData.results.length > 0) {
        const top = resData.results[0];
        const formattedCity = `${top.name}${top.country_code ? `, ${top.country_code}` : ''}`;
        onUpdate({
          city: formattedCity,
          lat: top.latitude,
          lon: top.longitude,
        });
        setCityInput('');
        setIsSearching(false);
      } else {
        setSearchError('City not found. Try another search.');
      }
    } catch {
      setSearchError('Network error while searching.');
    }
  };

  return (
    <div className="w-full flex flex-col space-y-3 select-none">
      {/* city header and change location trigger */}
      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setIsSearching(!isSearching)}
          className="flex items-center space-x-1.5 text-white/70 hover:text-white transition-colors"
          title="Click to change city"
        >
          <MapPin className="w-3.5 h-3.5 text-white/60" />
          <span className="font-medium truncate max-w-[170px]">{weather.city}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSearching(!isSearching)}
          className="text-[11px] text-white/40 hover:text-white transition-colors"
        >
          {isSearching ? 'Cancel' : 'Change City'}
        </button>
      </div>

      {/* manual city search form */}
      {isSearching && (
        <form onSubmit={handleSearchSubmit} className="space-y-1.5">
          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city (e.g. London, Paris, Tokyo)..."
              autoFocus
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-white/30"
            />
            <button
              type="submit"
              className="p-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-colors"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
          {searchError && <p className="text-[10px] text-red-400 pl-1">{searchError}</p>}
        </form>
      )}

      {/* current weather parameters */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-3">
          {renderWeatherIcon(weather.weatherCode, 'w-10 h-10')}
          <div>
            <div className="text-3xl font-light text-white leading-none">
              {weather.temperature}°C
            </div>
            <div className="text-xs text-white/60 mt-1 font-normal">{weather.condition}</div>
          </div>
        </div>

        <div className="text-right text-[11px] text-white/50 space-y-0.5 font-light">
          <div>Feels like {weather.feelsLike}°C</div>
          <div>Wind: {weather.windSpeed} km/h</div>
          <div>Humidity: {weather.humidity}%</div>
        </div>
      </div>

      {/* 5-day daily forecast strip */}
      {weather.daily.length > 0 && (
        <div className="grid grid-cols-5 gap-1.5 pt-3 mt-1 border-t border-white/5 text-center">
          {weather.daily.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1 py-1">
              <span className="text-[11px] text-white/50 font-medium">{day.day}</span>
              <div className="my-0.5">{renderWeatherIcon(day.weatherCode, 'w-4 h-4')}</div>
              <span className="text-[11px] text-white/80 font-light">
                {day.maxTemp}° <span className="text-white/35 text-[10px]">{day.minTemp}°</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
