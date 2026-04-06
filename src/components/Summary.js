import { useState } from "react";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function Summary({ watched }) {
  const avgImdbRating = Math.round(
    average(watched.map((movie) => movie.imdbRating)),
  );
  const avgUserRating = Math.round(
    average(watched.map((movie) => movie.userRating)),
  );
  const avgRuntime = Math.round(average(watched.map((movie) => movie.runtime)));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
