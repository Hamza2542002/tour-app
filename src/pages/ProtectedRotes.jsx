import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRotes({ children }) {
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  useEffect(
    function () {
      if (!isAuth) navigate("/");
    },
    [isAuth, navigate]
  );

  return isAuth ? children : null;
}

export default ProtectedRotes;
