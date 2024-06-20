import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from '../pages/HomePage';
import BookClub from './Books/BookClub';
import ProfilePage from '../pages/ProfilePage';
import Login from './User/LogIn';
import Signup from './User/Signup';
import { UserContext } from '../context/UserContext';



function PrivateRoute({ children, ...rest }) {
    const { user } = useContext(UserContext);
    return (
        <Route
            {...rest}
            render={() => {
                return user !== null ? (
                    children
                ) : (
                    <Redirect to="/login" />
                );
            }}
        />
    );
}

function App() {
    const { user, setUser } = useContext(UserContext);

    return (
        <div>
            <NavBar />
            <Switch>
                <PrivateRoute exact path="/"  >
                    <HomePage />
                </PrivateRoute>
                <PrivateRoute path="/book-club">
                    <BookClub />
                </PrivateRoute>
                <PrivateRoute path="/Profile" >
                    <ProfilePage />
                </PrivateRoute>
                <Route path="/login" component={Login} />
                <Route
                    path="/signup"
                    render={(props) => <Signup {...props} setUser={setUser} user={user} />}
                />
            </Switch>
        </div>

    );
}

export default App;