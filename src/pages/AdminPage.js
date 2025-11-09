import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button, Table, Image } from "react-bootstrap";
import { Notyf } from 'notyf';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import UserContext from '../UserContext';

export default function AdminPage() {
  const navigate = useNavigate();
  const notyf = new Notyf();
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: '', director: '', year: '', category: '', genre: [], age: '', description: '', files: []
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
        if (data.movies) setMovies([...data.movies].reverse());
        else notyf.error('No movies found.');
      })
      .catch(() => notyf.error('Error loading movies.'));
  };

  useEffect(() => {
    getMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add/update movie, delete, edit functions stay the same...
  // (Use the previous code as it’s correct)
  // Just remove unused 'user' from context
}
