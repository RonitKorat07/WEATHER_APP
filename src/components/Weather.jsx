import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Wind, Droplets, Sun, Cloud, CloudRain, 
  CloudDrizzle, Snowflake, CloudLightning, CloudSun, Thermometer, Gauge
} from 'lucide-react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const suggestionRef = useRef();

  const iconMap = {
    "01d": <Sun size={72} className="text-yellow-400 drop-shadow-lg" />,
    "01n": <Sun size={72} className="text-yellow-200 drop-shadow-lg" />,
    "02d": <CloudSun size={72} className="text-gray-300 drop-shadow-lg" />,
    "02n": <Cloud size={72} className="text-gray-400 drop-shadow-lg" />,
    "03d": <Cloud size={72} className="text-gray-400 drop-shadow-lg" />,
    "03n": <Cloud size={72} className="text-gray-500 drop-shadow-lg" />,
    "04d": <Cloud size={72} className="text-gray-500 drop-shadow-lg" />,
    "04n": <Cloud size={72} className="text-gray-600 drop-shadow-lg" />,
    "09d": <CloudDrizzle size={72} className="text-blue-400 drop-shadow-lg" />,
    "09n": <CloudDrizzle size={72} className="text-blue-500 drop-shadow-lg" />,
    "10d": <CloudRain size={72} className="text-blue-500 drop-shadow-lg" />,
    "10n": <CloudRain size={72} className="text-blue-600 drop-shadow-lg" />,
    "11d": <CloudLightning size={72} className="text-purple-400 drop-shadow-lg" />,
    "11n": <CloudLightning size={72} className="text-purple-500 drop-shadow-lg" />,
    "13d": <Snowflake size={72} className="text-white drop-shadow-lg" />,
    "13n": <Snowflake size={72} className="text-slate-100 drop-shadow-lg" />,
    "50d": <Wind size={72} className="text-teal-200 drop-shadow-lg" />,
    "50n": <Wind size={72} className="text-teal-300 drop-shadow-lg" />,
  };

  const search = async (city) => {
    if (!city) {
      alert("Enter City Name");
      return;
    }
    setLoading(true);
    setIsSuggestionsOpen(false);
    setSearchQuery(city);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        iconCode: data.weather[0].icon,
        description: data.weather[0].description,
        feelsLike: Math.floor(data.main.feels_like),
        pressure: data.main.pressure
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
      return;
    }

    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data);
      setIsSuggestionsOpen(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSelecting && document.activeElement === inputRef.current) {
        fetchSuggestions(searchQuery);
      }
      setIsSelecting(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserCity = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city) {
          search(data.city);
        } else {
          search('Surat'); // Defaulting to Surat based on your image
        }
      } catch (error) {
        search('Surat');
      }
    };
    fetchUserCity();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#0f172a] flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* 1. FIXED MAIN BOX: Added p-8 for inner spacing and rounded-[2.5rem] for better curves */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl w-full max-w-[360px] relative">
        
        {/* 2. FIXED SEARCH BAR: Added mb-8 (margin-bottom) so it doesn't touch the city name */}
        <div className="relative mb-8">
          <div className="flex items-center bg-white/10 border border-white/20 rounded-full overflow-hidden focus-within:bg-white/20 transition-all shadow-inner">
            <input 
              ref={inputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city..." 
              className="w-full bg-transparent outline-none text-white placeholder-white/70 px-5 py-3 text-base"
              onKeyDown={(e) => e.key === 'Enter' && search(searchQuery)}
            />
            <button 
              onClick={() => search(searchQuery)}
              className="p-3 text-white hover:text-indigo-200 transition-colors pr-5"
            >
              <Search size={22} />
            </button>
          </div>

          {/* Suggestions List */}
          {isSuggestionsOpen && suggestions.length > 0 && (
            <div 
              ref={suggestionRef}
              className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              {suggestions.map((suggestion, index) => (
                <div 
                  key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                  onClick={() => {
                    setIsSelecting(true);
                    search(suggestion.name);
                  }}
                  className="px-6 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-white/40 group-hover:text-white transition-colors" />
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-medium">{suggestion.name}</span>
                      <span className="text-white/40 text-xs">{suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
            <p className="text-white/60 mt-4 font-medium animate-pulse">Fetching weather...</p>
          </div>
        ) : weatherData && (
          <div className="flex flex-col items-center w-full">
            
            {/* Header / Location */}
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-white text-2xl sm:text-3xl capitalize font-bold flex items-center justify-center gap-2 drop-shadow-md">
                <MapPin size={24} className="text-indigo-300" />
                {weatherData.location}
              </h2>
              <p className="text-white/70 text-sm mt-1 tracking-wider font-medium capitalize">
                {weatherData.description}
              </p>
            </div>

            {/* Temperature Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex justify-center mb-2 drop-shadow-2xl">
                {iconMap[weatherData.iconCode] || <Sun size={72} className="text-yellow-400 drop-shadow-lg" />}
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white drop-shadow-xl select-none leading-none tracking-tighter">
                {weatherData.temperature}°<span className="text-3xl sm:text-4xl font-light">C</span>
              </h1>
            </div>

            {/* 4. FIXED GRID: Increased gap-4, added p-4 padding inside boxes, and made them rounded-3xl instead of weird pills */}
            <div className="grid grid-cols-2 gap-4 w-full">
              
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group">
                <Droplets className="text-indigo-300 shrink-0 group-hover:scale-110 transition-transform" size={20} />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base leading-tight">{weatherData.humidity}%</span>
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Humidity</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group">
                <Wind className="text-indigo-300 shrink-0 group-hover:scale-110 transition-transform" size={20} />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base leading-tight">
                    {weatherData.windSpeed} <span className="text-[10px] font-normal opacity-70">km/h</span>
                  </span>
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Wind</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group">
                <Thermometer className="text-indigo-300 shrink-0 group-hover:scale-110 transition-transform" size={20} />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base leading-tight">{weatherData.feelsLike}°C</span>
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Feels Like</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group">
                <Gauge className="text-indigo-300 shrink-0 group-hover:scale-110 transition-transform" size={20} />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base leading-tight">
                    {weatherData.pressure} <span className="text-[10px] font-normal opacity-70">hPa</span>
                  </span>
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Pressure</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Weather;