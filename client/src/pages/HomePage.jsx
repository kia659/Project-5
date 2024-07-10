import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import './HomePage.css'; 

const HomePage = () => {
    const { user } = useContext(UserContext);
    const [booksRead, setBooksRead] = useState([]);
    const [memberships, setMemberships] = useState([]);

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const response = await fetch('/memberships');
                if (!response.ok) {
                    throw new Error('Failed to fetch memberships');
                }
                const data = await response.json();
                setMemberships(data);
            } catch (error) {
                console.error('Error fetching memberships:', error);
            }
        };

        fetchMemberships();
    }, []);

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                if (user) {
                    const myClubIds = memberships.map(membership => membership.book_club_id);

                    // Fetch assignments
                    const assignmentsResponse = await fetch('/assignments');
                    if (!assignmentsResponse.ok) {
                        throw new Error('Failed to fetch assignments');
                    }
                    const assignments = await assignmentsResponse.json();

                    // Filter assignments for current user's clubs
                    const myAssignments = assignments.filter(assignment => myClubIds.includes(assignment.book_club_id));
                    const bookIds = myAssignments.map(assignment => assignment.book_id);

                    // Fetch books based on filtered assignments
                    const booksResponse = await fetch('/books');
                    if (!booksResponse.ok) {
                        throw new Error('Failed to fetch books');
                    }
                    const allBooks = await booksResponse.json();

                    // Filter books based on fetched bookIds
                    const filteredBooks = allBooks.filter(book => bookIds.includes(book.id));
                    setBooksRead(filteredBooks);
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchMyBooks();
    }, [user, memberships]);

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
                    {/* Add Google API integration for recommendations here */}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
