import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useAuth } from "../context/FakeAuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Spinner from "../components/Spinner";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuth, errorMessage, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(
    function () {
      if (isAuth) navigate("/app", { replace: true });
    },
    [isAuth, navigate]
  );

  async function handleLogin(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      setError(errorMessage);
    }
  }

  return (
    <main className={styles.login}>
      <Logo />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setError("");
              setEmail(e.target.value);
            }}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => {
              setError("");
              setPassword(e.target.value);
            }}
            value={password}
          />
        </div>
        {errorMessage && (
          <p className={styles.error}>{error || errorMessage}</p>
        )}
        <div>
          <Button type="primary" disabled={isLoading} onClick={handleLogin}>
            {isLoading ? <Spinner width="3rem" height="3rem" /> : "Login"}
          </Button>
          <p className={styles.link}>
            Dont't have account?
            <Link className={styles.link} to="/signup">
              Create new One
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
