import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


function NavBar() {
    const { user, logout } = useContext(UserContext);

    return (
        <nav className="navbar">
            {user ? (
                <>
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to="/book-club" className="nav-link">Book Club</NavLink>
                    <NavLink to="/profile" className="nav-link">Profile</NavLink>
                    <button onClick={logout} className="nav-link">Log Out</button>
                    {/* <NavLink to="/" className='nav-link' onClick={logout}>Logout</NavLink> */}
                </>
            ) : (
                <>
                    <NavLink to="/login" className="nav-link">Log In</NavLink>
                    <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
                </>
            )}
        </nav>
    );
}

export default NavBar;