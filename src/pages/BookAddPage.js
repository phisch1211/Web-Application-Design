
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap'; // Ensure you have react-bootstrap installed
import axios from 'axios';

const LoginPage = () => {
  const [genres, setGenres] = useState([]); // State to hold genres as objects
  const [title, setTitle] = useState(''); // State for book title
  const [review, setReview] = useState(''); // State for book review
  const [link, setLink] = useState(''); // State for book link
  const [selectedGenreId, setSelectedGenreId] = useState(''); // State to hold selected genre ID

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/genre/", {
          headers: {
            token: localStorage.getItem('token'),
            creatorID: localStorage.getItem('userID')
          }
        });

        // Check if genreList exists in the response
        if (response.data && response.data.genreList) {
          const genreList = response.data.genreList;
          const genresArray = genreList.map(genre => ({
            id: genre._id,
            title: genre.title
          }));
          setGenres(genresArray); // Set the genres state with objects containing id and title
        } else {
          alert("No genres found in the response.");
        }
      } catch (err) {
        window.location.href = "./login";
      }
    };

    fetchGenres(); // Call the function to fetch genres
  }, []); // Empty dependency array means this runs once on component mount

  const handleAdd = () => {
    if (!selectedGenreId) {
      alert("Please select a genre.");
      return;
    }

    axios.post("http://localhost:3000/api/genre/"+selectedGenreId+"/books", {
      title: title,
      definition: review,
      link: link, // Include the link in the POST request
      creatorID: localStorage.getItem('userID')
    }, {
      headers: {
        token: localStorage.getItem('token'),
        creatorID: localStorage.getItem('userID')
      }
    })
    .then((response) => {
      alert("Book added successfully!");
      // Optionally, reset form fields
      setTitle('');
      setReview('');
      setLink(''); // Reset the link input
      setSelectedGenreId(''); // Reset selected genre
      window.location.href = "./newBooks";
    })
    .catch((error) => {
      alert("Failed to add book");
    });
  };

  return (
    <>
      <h2>Here you can write a review for your favourite books</h2>
      <Form.Select 
        aria-label="Custom select example" 
        value={selectedGenreId} 
        onChange={(e) => setSelectedGenreId(e.target.value)} // Update the selected genre ID
      >
        <option value="">Select a genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.title}
          </option>
        ))}
      </Form.Select>
      <p>Did you not find a good genre?</p>
      <Button variant="primary" size="lg" href="./newGenre">
        Add new genre
      </Button>

      <p>This is the title of my book review</p>
      <input 
        type="text" 
        id="1" 
        name="title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Book Title" 
      />
      
      <p>This is the book review</p>
      <input 
        type="text" 
        id="2" 
        name="review" 
        value={review} 
        onChange={(e) => setReview(e.target.value)} 
        placeholder="Book Review" 
      />
      
      <p>This is the link to an online shop</p>
      <input 
        type="text" 
        id="3" 
        name="link" 
        value={link} 
        onChange={(e) => setLink(e.target.value)} 
        placeholder="Book Link" 
      />
      
      <p>Click to add your book recomendation</p>
      <Button variant="primary" size="lg" onClick={handleAdd}>
        Add New Book
      </Button>
    </>
  );
};

export default LoginPage;

