import { createContext, useContext, useEffect, useReducer } from "react";

// const BASE_URL = "http://localhost:9000/users"; for local host
const BASE_URL = "https://data-acyk.onrender.com/users";
const CITY_BASE_URL = "https://data-acyk.onrender.com/cities";
const AuthContext = createContext();
const initialState = {
  isAuth: false,
  user: null,
  users: [],
  isLoading: false,
  errorMessage: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "users/loaded": {
      return {
        ...state,
        users: action.payload,
      };
    }
    case "user/created": {
      return {
        ...state,
        user: action.payload,
        users: [...state.users, action.payload],
        isAuth: true,
      };
    }
    case "login": {
      return {
        ...state,
        user: action.payload,
        isAuth: true,
        isLoading: false,
        errorMessage: "",
      };
    }
    case "login/failed":
      return {
        ...state,
        isAuth: false,
        user: null,
        isLoading: false,
        errorMessage: action.payload,
      };
    case "logout": {
      return {
        ...state,
        user: null,
        isAuth: false,
      };
    }
    case "rejected": {
      return {
        ...state,
        isLoading: false,
      };
    }
    case "error": {
      return {
        ...state,
        errorMessage: action.payload,
        isAuth: false,
        isLoading: false,
      };
    }
    case "waiting":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      break;
  }
}

function AuthProvider({ children }) {
  const [{ isAuth, user, users, errorMessage, isLoading }, dispatch] =
    useReducer(reducer, initialState);
  useEffect(
    function () {
      async function fetchUsers() {
        dispatch({ type: "waiting", payload: true });
        try {
          const res = await fetch(`${BASE_URL}`);
          const data = await res.json();
          dispatch({ type: "users/loaded", payload: data });
        } catch {
          dispatch({ type: "rejeted", payload: "Cannot Fetch data" });
        } finally {
          dispatch({ type: "waiting", payload: false });
        }
      }
      fetchUsers();
    },
    [user]
  );

  function login(email, password) {
    dispatch({ type: "error", payload: "" });
    dispatch({ type: "waiting", payload: true });
    const user = users?.filter((item) => item.email === email)[0];
    if (email !== user?.email) {
      dispatch({ type: "login/failed", payload: "Email Not Found" });
      return;
    }
    if (password !== user?.password) {
      dispatch({ type: "login/failed", payload: "Password is not correct" });
      return;
    }
    if (email === user?.email && password === user?.password)
      dispatch({ type: "login", payload: user });
    return;
  }

  async function signup(newUser) {
    dispatch({ type: "waiting", payload: true });
    dispatch({ type: "error", payload: "" });
    const user = users?.filter((item) => item.email === newUser?.email)[0];
    if (user !== undefined) {
      dispatch({
        type: "error",
        payload: "This User has been rejestered before",
      });
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      const newCityData = {
        id: data.id,
        userCities: [],
      };

      dispatch({ type: "user/created", payload: data });
      try {
        await fetch(`${CITY_BASE_URL}`, {
          method: "POST",
          body: JSON.stringify(newCityData),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch {}
    } catch (error) {
      dispatch({ type: "error", payload: error.message });
    } finally {
      dispatch({ type: "waiting", payload: false });
    }
  }

  function logout() {
    if (isAuth) dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        user,
        isAuth,
        errorMessage,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) return;
  return context;
}

export { AuthProvider, useAuth };
