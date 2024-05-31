import { useEffect, useState } from "react";
import styles from "./SignUp.module.css";
import Button from "../components/Button";
import { useAuth } from "../context/FakeAuthContext";
import { useNavigate, Link } from "react-router-dom";
import Spinner from '../components/Spinner'
import Logo from "../components/Logo";

function SignUp() {
  const navigate = useNavigate();
  const { signup, errorMessage, isAuth , isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorMessage);

  useEffect(
    function () {
      setError("");
      if (isAuth) navigate("/app", { replace: true });
    },
    [isAuth, navigate]
  );

  async function handleSignup(e) {
    const user = {
      userName: name,
      email,
      password,
      avatar: "https://i.pravatar.cc/100?u=zz",
    };
    e.preventDefault();
    if (name && email && password) {
      await signup(user);
      setError(errorMessage);
    }
  }

  return (
    <main className={styles.login}>
      <Logo />
      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            value={name}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
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
              setPassword(e.target.value);
              setError("");
            }}
            value={password}
          />
        </div>
        {error && <p className={styles.error}>{errorMessage}</p>}
        <div>
          <Button type="primary" onClick={handleSignup}>
          {isLoading ? <Spinner width={'2rem'} height = {'2rem'} /> : 'Sign Up'}
          </Button>
          <p className={styles.link}>
            already have account?
            <Link className={styles.link} to="/login">
              Login
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default SignUp;
