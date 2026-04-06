import NavBar from "./components/NavBar";
import WatchedBox from "./components/WatchedBox";
import Summary from "./components/Summary";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";
import Error from "./components/Error";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];
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

  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?s=superman&apikey=${apikey}`,
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

    fetchMovies();
  }, []);

  return (
    <>
      <NavBar movies={movies} />
      <main className="main">
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <Error message={error} />}
        </Box>
        <Box>
          <Summary watched={watched} />
          <WatchedBox watched={watched} />
        </Box>
      </main>
    </>
  );
}
