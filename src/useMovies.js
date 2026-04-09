import { useState, useEffect } from "react";

export function useMovies(query, apikey) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  return { movies, isLoading, error };
}
