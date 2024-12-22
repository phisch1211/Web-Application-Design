import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap'; // Ensure you have react-bootstrap installed
import axios from 'axios';

const GenrePage = () => {
  const [genreName, setGenreName] = useState(''); // State for genre name
  const [genreDescription, setGenreDescription] = useState(''); // State for genre description

  const handleAdd = () => {
    axios
      .post(
        "http://localhost:3000/api/genre/", 
        {
          title: genreName, // The genre name
          definition: genreDescription, // The genre description
          creatorID: localStorage.getItem('userID') // Assuming userID is stored in localStorage
        },
        {
          headers: {
            token: localStorage.getItem('token') // The token to be sent with the request
          }
        }
      )
      .then((response) => {
        alert("Genre added successfully")
        setGenreName('');
        setGenreDescription('');
        window.location.href = "./bookDetails"; // Redirect after successful addition
      })
      .catch((error) => {
        alert("Failed to add genre: " + error.message); // Handle the error
      });
  };

  return (
    <>
      <h2>Here you can create a new genre</h2>

      <p>This is the name of the genre</p>
      <input 
        type="text" 
        id="genreName" 
        name="genreName" 
        value={genreName} 
        onChange={(e) => setGenreName(e.target.value)} 
        placeholder="Genre Name" 
      />

      <p>This is the genre description</p>
      <input 
        type="text" 
        id="genreDescription" 
        name="genreDescription" 
        value={genreDescription} 
        onChange={(e) => setGenreDescription(e.target.value)} 
        placeholder="Genre Description" 
      />
      
      <p>Click to add your new genre</p>
      <Button variant="primary" size="lg" onClick={handleAdd}>
        Add New Genre
      </Button>
    </>
  );
};

export default GenrePage;
