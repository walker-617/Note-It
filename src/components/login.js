import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import google from "../google_black.png";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Loading from "./Loading";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [load, setLoad] = useState(true);

  useEffect(() => {
    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        navigate("/home", { replace: true });
      } else {
        setLoad(false);
      }
    });

    return () => {
      authStateChanged();
    };
  }, []);

  function GoogleSignIn() {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        navigate("/home", { replace: true });
      })
      .catch((error) => {
        setError("error : " + error.code);
      });
  }

  return (
    <div className="login">
      {load ? (
        <Loading />
      ) : (
        <>
          Sign in with
          <div className="google" onClick={() => GoogleSignIn()}>
            <FcGoogle />
            <span>oogle</span>
          </div>
          <div>{error}</div>
        </>
      )}
    </div>
  );
}

export default Login;
