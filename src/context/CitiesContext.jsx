import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CitiesContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
        currentCity: {},
      };
    case "cities/loaded":
      return {
        ...state,
        cities: [...action.payload],
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: [...state.cities.filter((city) => city.id !== action.payload)],
        currentCity: {},
        isLoading: false,
      };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        isLoading: false,
      };
    case "city/loaded":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };
    case "rejected":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      break;
  }
}
const initialState = {
  cities: [],
  currentCity: {},
  isLoading: false,
  error: "",
};
function CitiesProvider({ children }) {
  const [{ cities, currentCity, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        // const res = await fetch("http://localhost:9000/cities");
        const res = await fetch("https://data-acyk.onrender.com/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "rejeted", payload: "Cannot Fetch data" });
      }
    }
    fetchCities();
  }, []);

  const getCurrentCity = useCallback(
    async function getCurrentCity(id) {
      if (id === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        // const res = await fetch(`http://localhost:9000/cities/${id}`);
        const res = await fetch(`https://data-acyk.onrender.com/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: `Error Deleting City ${id}` });
      }
    },
    [currentCity]
  );

  async function postCity(newCity) {
    dispatch({ type: "loading" });
    try {
      // const res = await fetch(`http://localhost:9000/cities`, {
      const res = await fetch(`https://data-acyk.onrender.com/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Error Adding City" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      // await fetch(`http://localhost:9000/cities/${id}`, {
      await fetch(`https://data-acyk.onrender.com/cities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: `Error Deleting City ${id}` });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCurrentCity,
        postCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) return;
  return context;
}

export { useCities, CitiesProvider };
