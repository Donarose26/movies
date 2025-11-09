import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserContext from './UserContext';
import NavbarComponent from './components/NavbarComponent';
import FooterComponent from './components/FooterComponent';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import AdminPage from './pages/AdminPage'; // ✅ make sure you have this page

function App() {
  const [user, setUser] = useState({
    id: null,
    email: null,
    isAdmin: false
  });

  const unsetUser = () => {
    localStorage.removeItem('token');
    setUser({ id: null, email: null, isAdmin: false });
  };

  // ✅ Fetch user details from token (so admin shows automatically after reload)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://movie-app-3wql.onrender.com/users/details', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser({
              id: data.user._id,
              email: data.user.email,
              isAdmin: data.user.isAdmin
            });
          }
        })
        .catch(err => console.error('Error fetching user details:', err));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser }}>
      <Router>
        <>
          <NavbarComponent />
          <div style={{ marginTop: '80px' }}> {/* ✅ avoid navbar overlap */}
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/admin" element={user.isAdmin ? <AdminPage /> : <Homepage />} />
            </Routes>
          </div>
          <FooterComponent />
        </>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
