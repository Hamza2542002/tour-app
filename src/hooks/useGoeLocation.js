import { useState } from "react";
export function useGeoLocation() {
  const [position, setPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  function getPosition() {
    setCount((s) => s + 1);
    setIsLoading(true);
    if (!navigator.geolocation) {
      return "Not Found";
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }
  return { isLoading, position, getPosition };
}
