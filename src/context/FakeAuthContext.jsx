import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
  isAuth: false,
  user: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuth: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuth: false,
      };
    default:
      break;
  }
}
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "0000",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ isAuth, user }, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    if (isAuth) dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isAuth,
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
