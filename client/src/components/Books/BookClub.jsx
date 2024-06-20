// components/Books/BookClub.jsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const BookClub = () => {
    const { user } = useContext(UserContext);
    const [bookClubs, setBookClubs] = useState([]);
    const [books, setBooks] = useState([]);
    const [clubMembers, setClubMembers] = useState({});
    const [selectedClubId, setSelectedClubId] = useState(null);
    const userMemberships = []
    for (const bookId in clubMembers) {
        if (clubMembers[bookId].find(u => u.id === user.id)) {
            userMemberships.push(Number(bookId))
        }
    }
    console.log(userMemberships)
    useEffect(() => {
        fetchBookClubs();
        fetchBooks();
    }, []);

    const fetchBookClubs = () => {
        fetch('/book_clubs')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch book clubs');
                }
                return response.json();
            })
            .then(data => {
                setBookClubs(data);
                data.forEach(club => fetchClubMembers(club.id));
            })
            .catch(error => {
                console.error('Error fetching book clubs:', error);
            });
    };

    const fetchBooks = () => {
        fetch('/books')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                return response.json();
            })
            .then(data => {
                setBooks(data);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    };



    const fetchClubMembers = (clubId) => {
        fetch(`/book_clubs/${clubId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch members for club ${clubId}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setClubMembers(prevMembers => ({
                    ...prevMembers,
                    [clubId]: data.memberships.map(m => m.user),
                }));

            })
            .catch(error => {
                console.error(`Error fetching members for club ${clubId}:`, error);
                setClubMembers(prevMembers => ({
                    ...prevMembers,
                    [clubId]: [],
                }));
            });
    };

    const joinBookClub = (clubId) => {
        fetch('/memberships', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user.id, club_id: clubId }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to join book club');
                }
                setClubMembers(prev => ({ ...prev, [clubId]: [...prev[clubId], user] }))
            })
            .catch(error => {
                console.error('Error joining book club:', error);
            });
    };

    const leaveBookClub = (clubId) => {
        fetch(`/memberships/${clubId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to leave book club');
                }
                setClubMembers(prev => ({ ...prev, [clubId]: prev[clubId].filter(u => u.id != user.id) }))
            })
            .catch(error => {
                console.error('Error leaving book club:', error);
            });
    };


    const addToClub = (bookId) => {
        fetch('/assignments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ book_id: bookId, club_id: selectedClubId }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add book to club');
                }
            })
            .catch(error => {
                console.error('Error adding book to club:', error);
            });
    };

    return (
        <div>
            <h1>Book Nook</h1>

            <h3>Book Clubs</h3>
            <ul>
                {bookClubs.map(club => (
                    <li key={club.id}>
                        <div>
                            <h4>{club.name}</h4>
                            <p>{club.description}</p>
                            <p>Members:</p>
                            <ul>
                                {clubMembers[club.id] && clubMembers[club.id].map(member => (
                                    <li key={member.id}>{member.username}</li>
                                ))}
                            </ul>
                            {!userMemberships.includes(club.id) ? (
                                <button onClick={() => joinBookClub(club.id)}>Join</button>
                            ) : (
                                <button onClick={() => leaveBookClub(club.id)}>Leave</button>)}
                        </div>
                    </li>
                ))}
            </ul>

            <h3>All Books</h3>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <div>
                            <h4>{book.title}</h4>
                            <p>{book.author}</p>
                            <p>{book.description}</p>
                            <select onChange={(e) => setSelectedClubId(e.target.value)}>
                                <option value="">Select Book Club</option>
                                {userMemberships.map(clubId => {
                                    const club = bookClubs.find(club => club.id === clubId);
                                    return <option key={clubId} value={clubId}>{club.name}</option>;
                                })}
                            </select>
                            <button onClick={() => addToClub(book.id)}>Add to Club</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookClub;