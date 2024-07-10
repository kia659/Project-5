import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import './HomePage.css'; 

const HomePage = () => {
    const { user } = useContext(UserContext);
    const [booksRead, setBooksRead] = useState([]);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [recommendedBook, setRecommendedBook] = useState(null); 

    useEffect(() => {
        const fetchBooksRead = async () => {
            try {
                if (user) {
                    const response = await fetch('/assignments');
                    if (!response.ok) {
                        throw new Error('Failed to fetch books read');
                    }
                    const assignments = await response.json();
                    const bookIds = assignments.map(assignment => assignment.book_id);

                    // Fetch details of books read
                    const booksResponse = await fetch('/books');
                    if (!booksResponse.ok) {
                        throw new Error('Failed to fetch book details');
                    }
                    const books = await booksResponse.json();
                    const filteredBooks = books.filter(book => bookIds.includes(book.id));
                    setBooksRead(filteredBooks);
                }
            } catch (error) {
                console.error('Error fetching books read:', error);
            }
        };

        const fetchRecommendedBooks = async () => {
            try {
                if (user) {
                    const url = `/recommended-books/${user.id}`;
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Failed to fetch recommended books');
                    }
                    const recommendedBooksData = await response.json();
                    
                    if (Array.isArray(recommendedBooksData)) {
                        setRecommendedBooks(recommendedBooksData);
                        
                        if (recommendedBooksData.length > 0) {
                            setRecommendedBook(recommendedBooksData[0]);
                        } else {
                            setRecommendedBook(null); 
                        }
                    } else if (typeof recommendedBooksData === 'object') {
                        setRecommendedBooks([recommendedBooksData]);
                        setRecommendedBook(recommendedBooksData);
                    } else {
                        console.error('Invalid recommended books data format:', recommendedBooksData);
                    }
                }
            } catch (error) {
                console.error('Error fetching recommended books:', error);
            }
        };

        fetchBooksRead();
        fetchRecommendedBooks();
    }, [user]);

    const fetchRecommendedBook = async () => {
        try {
            const response = await fetch(`/recommended-books/${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch recommended book');
            }
            const recommendedBookData = await response.json();
            console.log(recommendedBookData)
            setRecommendedBook(recommendedBookData); 
        } catch (error) {
            console.error('Error fetching recommended book:', error);
        }
    };

    const handleRefreshClick = () => {
        fetchRecommendedBook(); 
    };

    return (
        <div className="home-page-container">
            <h1 className="welcome-message">Welcome to Fireside Book~Nook!</h1>
            <div className="main-content">
                <div className="section-container books-section">
                    <h2>Books You've Read</h2>
                    <ul className="books-read-list">
                        {booksRead.map(book => (
                            <li key={book.id}>
                                <img src={book.image_url} alt={book.title} />
                                <div className="book-details">
                                    <h3>{book.title}</h3>
                                    <p>Author: {book.author}</p>
                                    <p>Description: {book.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="section-container recommended-section">
                    <h2>Recommended Books</h2>
                    <ul className="recommended-books-list">
                        {recommendedBooks.map(book => (
                            <li key={book.title}>
                                    <img src={book.smallThumbnail} alt={book.title} style={{ display: 'block', margin: '0 auto' }} />                                <div className="book-details">
                                    <h3>{book.title}</h3>
                                    <p>Author: {book.authors.join(', ')}</p>
                                    <p>Description: {book.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleRefreshClick} style={{ display: 'block', margin: '0 auto' }}>Generate Another Book</button>                </div>
            </div>
        </div>
    );
};

export default HomePage;
