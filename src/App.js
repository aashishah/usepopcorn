import NavBar from "./components/NavBar";
import WatchedBox from "./components/WatchedBox";
import Summary from "./components/Summary";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import Error from "./components/Error";
import MovieDetails from "./components/MovieDetails";

const apikey = `${process.env.REACT_APP_OMDB_KEY}`;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelctedMovie] = useState(null);

  function handleSelectMovie(id) {
    setSelctedMovie((selectId) => (id === selectId ? null : id));
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((m) => m.imdbID !== id));
  }

  function handleUnselect() {
    setSelctedMovie(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${apikey}`,
            { signal: controller.signal },
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

      return function () {
        controller.abort();
      };
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
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedBox watched={watched} onDeleteMovie={handleDeleteMovie} />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
