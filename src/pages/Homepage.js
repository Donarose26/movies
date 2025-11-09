import { useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import "../index.css";

export default function Homepage() {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ top: 5, left: 0 });


  const scrollRefs = useRef({});

  // Fetch movies
  useEffect(() => {
    fetch("https://movie-app-3wql.onrender.com/movies/getMovies")
    .then((res) => res.json())
    .then((data) => {
      if (data.movies) {
        setMovies(data.movies);
          // Get unique categories
        setCategories([...new Set(data.movies.map((m) => m.category))]);
      }
    })
    .catch((err) => console.error(err));
  }, []);

  const scroll = (category, direction) => {
    const row = scrollRefs.current[category];
    if (row) {
      row.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // Click outside closes preview
  useEffect(() => {
    const handleClick = () => setActiveMovie(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <Container>
          <h1 className="display-4 fw-bold">Welcome to MovieVerse</h1>
          <p className="lead">
            Discover the latest blockbusters and hidden gems across all genres.
          </p>
        </Container>
      </section>

      {/* MOVIE SLIDER SECTIONS */}
      <Container className="py-5">
        {categories.map((category) => {
          const categoryMovies = movies.filter((m) => m.category === category);

          return (
            <div key={category} className="mb-5 row-wrapper">
              <h3 className="mb-3 text-capitalize">{category}</h3>

              {/* LEFT BUTTON */}
              <Button
                className="slider-btn left-btn"
                onClick={() => scroll(category, "left")}
              >
                <BsChevronLeft size={30} />
              </Button>

              {/* HORIZONTAL SCROLL ROW */}
              <div
                className="horizontal-scroll"
                ref={(el) => (scrollRefs.current[category] = el)}
              >
                {categoryMovies.map((movie) => (


                  <div
                    key={movie._id}
                    className="movie-poster"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setPreviewPosition({ top: rect.top -300, left: rect.left});
                      setActiveMovie(movie._id);
                      setSelectedMovie(movie);
                    }}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        if (!document.querySelector(".preview-card:hover")) {
                          setActiveMovie(null);
                          setSelectedMovie(null);
                        }
                      }, 0);
                    }}
                  >
                    <img
                      src={movie.images[0]}
                      alt={movie.title}
                      className="rounded"
                    />
                  </div>

                  ))}
              </div>

              {/* RIGHT BUTTON */}
              <Button
                className="slider-btn right-btn"
                onClick={() => scroll(category, "right")}
              >
                <BsChevronRight size={30} />
              </Button>

              {/* PREVIEW CARD */}
              {activeMovie && selectedMovie && categoryMovies.some((m) => m._id === activeMovie) && (
                <div
                  className="preview-card"
                  style={{
                    top: `${previewPosition.top}px`,
                    left: `${previewPosition.left}px`,
                  }}
                  onMouseLeave={() => {
                    setActiveMovie(null);
                    setSelectedMovie(null);
                  }}
                >
                  <img
                    src={selectedMovie.images[0]}
                    className="preview-image"
                    alt=""
                  />
                  <div className="preview-content">
                    <h4>{selectedMovie.title}</h4>

                    <div className="preview-buttons">
                      <button className="circle-btn play">
                        <i className="bi bi-play-fill"></i>
                      </button>
                      <button className="circle-btn">
                        <i className="bi bi-plus"></i>
                      </button>
                      <button className="circle-btn">
                        <i className="bi bi-download"></i>
                      </button>
                      <button
                        className="circle-btn info"
                        onClick={() => setShowInfo(true)}
                      >
                        <i className="bi bi-chevron-down"></i>
                      </button>
                    </div>

                    <div className="meta">
                      <span  className="age-box">{selectedMovie.age}+</span> 
                    </div>

                    <span>
                      {Array.isArray(selectedMovie.genre)
                      ? selectedMovie.genre.join(" • ")
                      : selectedMovie.genre}
                    </span>
                  </div>
                </div>
                )}
            </div>
            );
        })}
</Container>

      {/* FULLSCREEN MODAL */}
{showInfo && selectedMovie && (
  <div className="movie-modal" onClick={() => setShowInfo(false)}>
    <div
      className="movie-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={selectedMovie.images[0]}
        className="movie-modal-banner"
        alt=""
      />
      <button
        className="modal-close-btn"
        onClick={() => setShowInfo(false)}
      >
        <i className="bi bi-x-lg"></i>
      </button>

      <div className="movie-modal-details">
        <h2>{selectedMovie.title}</h2>

        <div className="modal-buttons">
          <button className="modal-play-btn">
            <i className="bi bi-play-fill"></i> Play
          </button>
          <button className="circle-btn">
            <i className="bi bi-plus"></i>
          </button>
          <button className="circle-btn">
            <i className="bi bi-download"></i>
          </button>
        </div>

        <div className="modal-meta">
          <span className="age">{selectedMovie.age}</span>
          <span>{selectedMovie.year}+</span>
          <span>
            {Array.isArray(selectedMovie.genre)
            ? selectedMovie.genre.join(", ")
            : selectedMovie.genre}
          </span>
        </div>

        <p className="modal-description">{selectedMovie.description}</p>
      </div>
    </div>
  </div>
  )}
</div>
);
}
