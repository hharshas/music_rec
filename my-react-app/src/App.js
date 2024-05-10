import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);
    // Fetch suggestions from the server only if input value is not empty
    if (value.trim() !== '') {
      fetchSuggestions(value);
    } else {
      // Clear suggestions when input value is empty
      setSuggestions([]);
    }
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/autocomplete?query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuggestionClick = (value) => {
    setInputValue(value);
    setSuggestions([]);
  };

  const handleRecommendation = async () => {
    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ music_title: inputValue })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const data = await response.json();
      setRecommendations(data.recommendations); // Update recommendations state
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Music Recommendation System</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter a music title..."
      />
      <div className="suggestions">
        <ul>
          {suggestions.slice(0, 4).map((suggestion, index) => (
            <li
              key={index}
              className="suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleRecommendation}>
        Recommend
      </button>
      <div>
        <h2>Recommended Music:</h2>
        <ul>
          {recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
