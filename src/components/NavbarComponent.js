import { Navbar, Nav, Container, Dropdown, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState, useRef } from 'react';
import UserContext from '../UserContext';

export default function NavbarComponent() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Fetch user details
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      return;
    }

    fetch('https://movie-app-3wql.onrender.com/users/details', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser({
            id: data.user._id,
            email: data.user.email,
            isAdmin: data.user.isAdmin
          });
          setIsAdmin(data.user.isAdmin);
        }
      })
      .catch(err => {
        console.error(err);
        setIsAdmin(false);
      });
  }, [setUser, user.id]);

  // Handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser({ id: null, isAdmin: false });
    setIsAdmin(false);
    navigate('/login');
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    navigate(`/movies?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setSearchOpen(false);
  };

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Navbar bg="white" variant="light" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/home">MovieVerse</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
       

          {/* Left-side links */}
          <Nav className="me-auto align-items-center">
            <Nav.Link as={Link} to="/homepage">Home</Nav.Link>
            <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
          </Nav>

          {/* Right-side: search + account */}
          <Nav className="ms-auto align-items-center">

            {/* Netflix-style search */}
            <div ref={searchRef} className={`search-container ${searchOpen ? 'open' : ''}`}>
              <Form onSubmit={handleSearch} className="d-flex align-items-center">
                <Form.Control
                  type="text"
                  placeholder={searchOpen ? "Search movies..." : ""}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="transition-width"
                  style={{ display: searchOpen ? 'block' : 'none' }}
                />
                <Button
                  variant="outline-primary"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="search-btn"
                >
                  <i className="bi bi-search"></i>
                </Button>
              </Form>
            </div>

            {/* User Dropdown */}
<Dropdown align="end" className="ms-2">
  <Dropdown.Toggle variant="secondary" id="user-dropdown">
    <i className="bi bi-person-circle" style={{ fontSize: "1.5rem" }}></i>
  </Dropdown.Toggle>

  <Dropdown.Menu>
    {user.id ? (
      <>
        {isAdmin && <Dropdown.Item as={Link} to="/admin">Admin</Dropdown.Item>}
        <Dropdown.Item as={Link} to="/account">Account</Dropdown.Item>
        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
      </>
    ) : (
      <>
        <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
        <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
      </>
    )}
  </Dropdown.Menu>
</Dropdown>


          </Nav>
       
      </Container>
    </Navbar>
  );
}
