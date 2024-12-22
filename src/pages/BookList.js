import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookList = () => {
    const [bookDetails, setBookDetails] = useState({
        title: '',
        description: '',
        link: '',
        reviews: []
    });
    const [loading, setLoading] = useState(true);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [newReview, setNewReview] = useState('');
    const { bookID, genreID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookDetails = async () => {
            setLoading(true);
            try {
                // Fetch book details
                const bookData = await axios.get(`http://localhost:3000/api/genre/${genreID}/books/${bookID}`, {
                    headers: {
                        token: localStorage.getItem('token'),
                        creatorID: localStorage.getItem('userID')
                    }
                });
                setBookDetails({
                    title: bookData.data.title || '',
                    description: bookData.data.description || '',
                    link: bookData.data.link || '',
                    reviews: [] // Set to an empty array if no reviews
                });

                // Fetch reviews for the book
                const reviewsData = await axios.get(`http://localhost:3000/api/genre/${genreID}/books/${bookID}/reviews`, {
                    headers: {
                        token: localStorage.getItem('token'),
                        creatorID: localStorage.getItem('userID')
                    }
                });

                setBookDetails({
                    title: bookData.data.title || '',
                    description: bookData.data.description || '',
                    link: bookData.data.link || '',
                    reviews: reviewsData.data.reviewList || [] // Set to an empty array if no reviews
                });

            } catch (err) {
                console.error("Error fetching book details or reviews", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [bookID, genreID]);

    const nextReview = () => {
        if (currentReviewIndex < bookDetails.reviews.length - 1) {
            setCurrentReviewIndex(prevIndex => prevIndex + 1);
        }
    };

    const previousReview = () => {
        if (currentReviewIndex > 0) {
            setCurrentReviewIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleReviewChange = (event) => {
        setNewReview(event.target.value);
    };

    const handleSubmitReview = async () => {
        if (newReview.trim()) {
            try {
                const response = await axios.post(`http://localhost:3000/api/genre/${genreID}/books/${bookID}/reviews`, 
                    { title: "Review", text: newReview, rating: 0, creatorID: localStorage.getItem('userID') },
                    {
                        headers: {
                            token: localStorage.getItem('token'),
                            creatorID: localStorage.getItem('userID')
                        }
                    }
                );

                // Update state with the new review
                setBookDetails(prevDetails => ({
                    ...prevDetails,
                    reviews: [...prevDetails.reviews, response.data.newReview]
                }));

                setNewReview(''); // Clear the review input
            } catch (err) {
                console.error("Error submitting the review", err);
            }
        } else {
            alert("Please write a review before submitting.");
        }
    };

    const handleDeleteReview = async () => {
        const reviewID = bookDetails.reviews[currentReviewIndex]?._id;
        if (reviewID) {
            const confirmDelete = window.confirm("Are you sure you want to delete this review?");
            if (confirmDelete) {
                try {
                    await axios.delete(`http://localhost:3000/api/genre/${genreID}/books/${bookID}/reviews/${reviewID}`, {
                        data: { creatorID: localStorage.getItem('userID') },
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    });

                    // Remove the deleted review from state
                    setBookDetails(prevDetails => ({
                        ...prevDetails,
                        reviews: prevDetails.reviews.filter((_, index) => index !== currentReviewIndex)
                    }));

                    // Adjust the current review index
                    if (currentReviewIndex >= bookDetails.reviews.length - 1) {
                        setCurrentReviewIndex(prevIndex => Math.max(prevIndex - 1, 0));
                    }
                } catch (err) {
                    console.error("Error deleting the review", err);
                }
            }
        }
    };

    const handleDeleteBook = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/genre/${genreID}/books/${bookID}`, {
                    data: { creatorID: localStorage.getItem('userID') },
                    headers: {
                        token: localStorage.getItem('token')
                    }
                });

                alert("Book deleted successfully!");
                navigate(`/genres/${genreID}/books`);
            } catch (err) {
                console.error("Error deleting the book", err);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const currentReview = bookDetails.reviews[currentReviewIndex];

    return (
        <div>
            {/* Display the book title as the main headline */}
            
            <h2>{bookDetails.title}</h2>
            <h5>{bookDetails.description}</h5>
            {bookDetails.link && (
                <h3>
                    <a href={bookDetails.link} target="_blank" rel="noopener noreferrer">
                        Book Link
                    </a>
                </h3>
            )}
            
            {/* Only display the review section if there are reviews */}
            {bookDetails.reviews.length > 0 && (
                <>
                    <h5>Review:</h5>
                        {currentReview ? (
                            <div>
                                <strong>{currentReview.title}</strong>
                                <p>{currentReview.description}</p>
                            </div>
                        ) : (
                            <p>No reviews available</p>
                        )}
                    <div>
                        <button onClick={previousReview} disabled={currentReviewIndex === 0}>Previous</button>
                        <button onClick={nextReview} disabled={currentReviewIndex === bookDetails.reviews.length - 1}>Next</button>
                    </div>
                </>
            )}

            {/* Always show the input for adding a new review */}
            <h5>Add a New Review:</h5>
            <textarea
                value={newReview}
                onChange={handleReviewChange}
                placeholder="Write your review here..."
                rows="4"
                style={{ width: '100%' }}
            />
            <div>
                <button onClick={handleSubmitReview}>Submit Review</button>
            </div>

            <div>
                <button onClick={handleDeleteReview} disabled={!currentReview}>Delete Current Review</button>
                <button onClick={handleDeleteBook}>Delete This Book</button>
            </div>
        </div>
    );
};

export default BookList;