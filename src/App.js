import NavBar from "./components/NavBar";
import WatchedBox from "./components/WatchedBox";
import Summary from "./components/Summary";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import Error from "./components/Error";
import MovieDetails from "./components/MovieDetails";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorage";

const apikey = `${process.env.REACT_APP_OMDB_KEY}`;

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelctedMovie] = useState(null);

  const keyName = "watched";

  const { movies, isLoading, error } = useMovies(query, apikey);

  const [watched, setWatched] = useLocalStorageState([], keyName);

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
