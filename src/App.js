import logo from './mari.png';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [formattedData, setFormattedData] = useState('');

  useEffect(() => {
    axios.get("https://mitveszunk.click:5000/recipes")
      .then(res => {
        console.log(res.data)
        setData(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleCheckboxChange = (recipeId) => {
    // Toggle the selection status of the recipeId
    setSelectedRecipeIds(prevIds => {
      if (prevIds.includes(recipeId)) {
        return prevIds.filter(id => id !== recipeId);
      } else {
        return [...prevIds, recipeId];
      }
    });
  };

  const handleFetchRecipes = () => {
    const requestBody = {
      recipe_ids: selectedRecipeIds
    };

    axios.post("https://mitveszunk.click:5000/recipe-aggregator", requestBody)
      .then(res => {
        console.log("POST response:", res.data);
        // Update the state with the formatted data
        setFormattedData(formatData(res.data));
      })
      .catch(err => {
        console.log("POST error:", err);
      });
  };

  // Function to format the data
  const formatData = (data) => {
    let result = '';
    for (const category in data) {
      result += `${category}\n`;

      data[category].forEach(item => {
        result += `- ${item.ingridient} ${item.amount} ${item.measure}\n`;
      });
    }

    return result;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Mari very cuki mit(v)eszünk appja.</p>
        {data.map(recipe => (
          <div key={recipe.recept_id}>
            <input
              id={recipe.recept_id}
              type='checkbox'
              value={recipe.recept_name}
              onChange={() => handleCheckboxChange(recipe.recept_id)}
            />
            <label htmlFor={recipe.recept_id}>{recipe.recept_name}</label>
          </div>
        ))}
        <button onClick={handleFetchRecipes}>Receptek lekérdezése</button>
        {/* Display the formatted data */}
        <div>
          <h2>Bevásárlólista</h2>
          <pre>{formattedData}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
