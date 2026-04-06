import NavBar from "./components/NavBar";
import WatchedBox from "./components/WatchedBox";
import Summary from "./components/Summary";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";
import Error from "./components/Error";
import MovieDetails from "./components/MovieDetails";

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const apikey = `${process.env.REACT_APP_OMDB_KEY}`;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelctedMovie] = useState(null);

  function handleSelectMovie(id) {
    setSelctedMovie((selectId) => (id === selectId ? null : id));
  }

  function handleUnselect() {
    setSelctedMovie(null);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${apikey}`,
          );

          if (!res.ok) {
            setError("Something went wrong!");
            throw new Error("Something went wrong!");
          }

          const data = await res.json();

          if (data.Response === "False") {
            setError("Movie not found!");
            throw new Error("Movie not found.");
          }

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
    },
    [query],
  );

  return (
    <>
      <NavBar movies={movies} query={query} setQuery={setQuery} />
      <main className="main">
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedMovie ? (
            <MovieDetails
              selectedId={selectedMovie}
              onUnselect={handleUnselect}
              apikey={apikey}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedBox watched={watched} />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
