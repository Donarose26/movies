import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Carousel } from "react-bootstrap";

export default function MoviesCollection() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const genres = ["all", "action", "drama", "comedy", "thriller", "sci-fi", "romance"];

  // Fetch movies from backend
  useEffect(() => {
    fetch("https://movie-app-3wql.onrender.com/movies/getMovies")
      .then(res => res.json())
      .then(data => {
        if (data.movies) setMovies(data.movies);
        else setMovies([]);
      })
      .catch(err => {
        console.error("Error fetching movies:", err);
        setMovies([]);
      });
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesFilter = filter === "all" || movie.genre.toLowerCase() === filter.toLowerCase();
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="movies-collection py-5 mt-5">
      <Container>
        <div className="text-center mb-4">
          <h1 className="mb-3">Movies Collection</h1>
          <p>Explore our extensive library of movies across all genres and eras.</p>
        </div>

        {/* Filters */}
        <div className="d-flex flex-wrap justify-content-center mb-4 gap-2">
          {genres.map((g) => (
            <Button
              key={g}
              variant={filter === g ? "primary" : "secondary"}
              onClick={() => setFilter(g)}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Button>
          ))}
        </div>

        {/* Search */}
        <Form className="d-flex justify-content-center mb-4">
          <Form.Control
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "400px" }}
          />
        </Form>

        {/* Movies Grid */}
        <Row>
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <Col key={movie._id} xs={12} sm={6} md={4} lg={4} className="mb-4">
                <Card className="movie-card h-100 movie-card">
                  {/* Display images as carousel if multiple */}
                  {movie.images && movie.images.length > 0 && (
                    <Carousel variant="dark" interval={null}>
                      {movie.images.map((img, idx) => (
                        <Carousel.Item key={idx}>
                          <Card.Img variant="top" src={img} />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">{movie.title}</Card.Title>
                    <p className="text-secondary mb-0">{movie.year} • {movie.genre}</p>
                    <p className="text-secondary mb-1">Directed by {movie.director}</p>
                    <Card.Text>{movie.description}</Card.Text>
                    <div className="d-flex gap-2 flex-wrap mt-auto">
                      <Button variant="primary">
                        <i className="bi bi-play-circle me-2"></i>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No movies available.</p>
          )}
        </Row>
      </Container>
    </section>
  );
}
