import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap'; // Ensure you have react-bootstrap installed
import axios from 'axios';

const NewBookList = () => {
  const [genres, setGenres] = useState([]); // State to hold genres as objects
  const [books, setBooks] = useState([]); // State to hold books for the selected genre
  const [title, setTitle] = useState(''); // State for book title
  const [review, setReview] = useState(''); // State for book review
  const [link, setLink] = useState(''); // State for book link
  const [selectedGenreId, setSelectedGenreId] = useState(''); // State to hold selected genre ID
  const [selectedBookId, setSelectedBookId] = useState(''); // State to hold selected book ID

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/genre/", {
          headers: {
            token: localStorage.getItem('token'),
            creatorID: localStorage.getItem('userID')
          }
        });

        if (response.data && response.data.genreList) {
          const genreList = response.data.genreList;
          const genresArray = genreList.map(genre => ({
            id: genre._id,
            title: genre.title
          }));
          setGenres(genresArray);
        } else {
          alert("No genres found in the response.");
        }
      } catch (err) {
        window.location.href = "./login";
        console.error(err);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      if (selectedGenreId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/genre/${selectedGenreId}/books`, {
            headers: {
              token: localStorage.getItem('token'),
              creatorID: localStorage.getItem('userID')
            }
          });

          if (response.data && response.data.bookList) {
            const booksArray = response.data.bookList.map(book => ({
              id: book._id,
              title: book.title
            }));
            setBooks(booksArray);
          } else {
          }
        } catch (err) {
          alert("Failed to fetch books: " + err.message);
          console.error(err);
        }
      } else {
        setBooks([]); // Clear books if no genre is selected
      }
    };

    fetchBooks();
  }, [selectedGenreId]);

  const handleAdd = () => {
    if (!selectedGenreId) {
      alert("Please select a genre.");
      return;
    }

    axios.post(`http://localhost:3000/api/genre/${selectedGenreId}/books`, {
      title: title,
      definition: review,
      link: link,
      creatorID: localStorage.getItem('userID')
    }, {
      headers: {
        token: localStorage.getItem('token'),
        creatorID: localStorage.getItem('userID')
      }
    })
    .then((response) => {
      alert("Book added successfully: " + JSON.stringify(response.data));
      setTitle('');
      setReview('');
      setLink('');
      setSelectedGenreId('');
      setSelectedBookId('');
      setBooks([]); // Clear books after adding a new book
    })
    .catch((error) => {
      alert("Failed to add book: " + error.message);
    });
  };

  const redirectToBook = () => {
    window.location.href = `./myBooks/${selectedGenreId}/${selectedBookId}`;
  };

  return (
    <>
      <h2>Here you can find a new book to read</h2>
      <Form.Select 
        aria-label="Select a genre" 
        value={selectedGenreId} 
        onChange={(e) => {
          setSelectedGenreId(e.target.value);
          setBooks([]); // Clear books when genre changes
        }} 
      >
        <option value="">Select a genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.title}
          </option>
        ))}
      </Form.Select>

      <Form.Select 
        aria-label="Select a book" 
        value={selectedBookId} 
        onChange={(e) => setSelectedBookId(e.target.value)} // Update the selected book ID
      >
        <option value="">Select a book</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.title}
          </option>
        ))}
      </Form.Select>

      <p>Click to be redirected to the book</p>
      <Button variant="primary" size="lg" onClick={redirectToBook}>
        Go to Book
      </Button>
    </>
  );
}
export default NewBookList;