import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, keyName) {
  const [value, setValue] = useState(() => {
    const storedValue = JSON.parse(localStorage.getItem(keyName));
    return storedValue ? storedValue : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(keyName, JSON.stringify(value));
    },
    [value, keyName],
  );

  return [value, setValue];
}
