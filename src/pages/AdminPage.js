import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Table, Image } from "react-bootstrap";
import { Notyf } from 'notyf';
import UserContext from '../UserContext';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import 'notyf/notyf.min.css';

export default function AdminPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf();

  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: '',
    director: '',
    year: '',
    category: '',
    genre: [], // array for multi-select
    age: '',
    description: '',
    files: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      notyf.error('Access denied. Please log in as admin.');
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch all movies
  const getMovies = () => {
    fetch('https://movie-app-3wql.onrender.com/movies/getMovies')
      .then(res => res.json())
      .then(data => {
        if (data.movies) {
        // ✅ NEWEST FIRST
        setMovies([...data.movies].reverse());
      } else {
        notyf.error('No movies found.');
      }
      })
      .catch(err => {
        console.error(err);
        notyf.error('Error loading movies.');
      });
  };

  useEffect(() => {
    getMovies();
  }, []);

  // Add or update movie
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate year 4 digits
    if (!/^\d{4}$/.test(form.year)) {
      notyf.error('Year must be 4 digits.');
      return;
    }

    if (!token) {
      notyf.error("No token found. Please log in again.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('director', form.director);
    formData.append('year', form.year);
    formData.append('category', form.category);
    formData.append('age', form.age);
    form.genre.forEach(g => formData.append('genre', g));
    formData.append('description', form.description);

    if (form.files?.length > 0) {
      form.files.forEach(file => formData.append("images", file));
    }

    const url = isEditing
      ? `https://movie-app-3wql.onrender.com/movies/updateMovie/${editingId}`
      : `https://movie-app-3wql.onrender.com/movies/addMovie`;

    const method = isEditing ? "PATCH" : "POST";

    fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
      .then(async (res) => {
        const raw = await res.text();
        console.log("RAW RESPONSE:", raw);

        try {
          const data = JSON.parse(raw);
          if (!res.ok) throw new Error(data.message || "Server error");
          return data;
        } catch (err) {
          console.error("HTML/Parse ERROR:", err);
          notyf.error("Server did not return JSON. Check backend logs.");
          throw err;
        }
      })
      .then((data) => {
        notyf.success(data.message);
        setForm({
          title: '',
          director: '',
          year: '',
          category: '',
          genre: [],
          age: '',
          description: '',
          files: []
        });
        setIsEditing(false);
        getMovies();
      })
      .catch((err) => {
        console.error(err);
        notyf.error("Request failed.");
      });
  };

  // Delete movie
  const deleteMovie = (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    fetch(`https://movie-app-3wql.onrender.com/movies/deleteMovie/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        notyf.success(data.message);
        getMovies();
      })
      .catch(err => {
        console.error(err);
        notyf.error('Error deleting movie.');
      });
  };

  // Edit movie
  const editMovie = (movie) => {
    setForm({
      title: movie.title,
      director: movie.director,
      year: movie.year,
      category: movie.category || '',
      genre: movie.genre || [],
      age: movie.age || '',
      description: movie.description,
      files: []
    });
    setEditingId(movie._id);
    setIsEditing(true);
  };

  // Available genre options
  const genreOptions = ["Action", "Comedy", "Drama", "Horror", "Romance", "Thriller", "Adventure", "Sci-Fi"];

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container fluid className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5">
        <Row className="justify-content-center w-100">
          <Col xs={12} sm={10} md={8} lg={6}>
            <div className="card card-custom p-4 shadow">
              <div className="text-center mb-4">
                <h1 className="mb-2">🎬 Admin Dashboard</h1>
                <p className="text-muted mb-0">Add, edit, or remove movies</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Director</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.director}
                    onChange={(e) => setForm({ ...form, director: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    placeholder="e.g. 2025"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g. Featured, Trending"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Genres</Form.Label>
  <Select
    isMulti
    options={genreOptions.map(g => ({ value: g, label: g }))}
    value={form.genre.map(g => ({ value: g, label: g }))}
    onChange={(selectedOptions) => {
      const selected = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
      setForm({ ...form, genre: selected });
    }}
    placeholder="Select genres..."
  />
</Form.Group>


                <Form.Group className="mb-3">
                  <Form.Label>Minimum Age</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g. 13"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    min={0}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Movie Images (Upload)</Form.Label>
                  <Form.Control
                    type="file"
                    name="images"
                    multiple
                    onChange={(e) => setForm({ ...form, files: Array.from(e.target.files) })}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  {isEditing ? 'Update Movie' : 'Add Movie'}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>

        {/* Movie List */}
        <Row className="justify-content-center w-100 mt-5">
          <Col xs={12} sm={10} md={8} lg={10}>
            <Table striped bordered hover responsive className="shadow">
              <thead className="table-dark">
                <tr>
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Director</th>
                  <th>Year</th>
                  <th>Category</th>
                  <th>Genres</th>
                  <th>Age</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie._id}>
                    <td>
                      {movie.images && movie.images.map((img, index) => (
                        <Image key={index} src={img} thumbnail width={80} className="me-1"/>
                      ))}
                    </td>
                    <td>{movie.title}</td>
                    <td>{movie.director}</td>
                    <td>{movie.year}</td>
                    <td>{movie.category}</td>
                    <td>{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</td>
                    <td>{movie.age ? `${movie.age}+` : ''}</td>
                    <td>{movie.description}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => editMovie(movie)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteMovie(movie._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
