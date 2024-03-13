import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import google from "../google_black.png";
import { useState } from "react";

function Login() {

  const navigate=useNavigate();
  const [error,setError]=useState("")

  function GoogleSignIn(){
    signInWithPopup(getAuth(), new GoogleAuthProvider()).then((result) => {
      navigate("/home")
    })
    .catch((error) => {
      setError("Something went wrong. Try again.")
    })
  }

  return (
    <>
      <div className="login">
        Sign in with
        <img src={google} className="google" onClick={GoogleSignIn}/>
        <div>{error}</div>
      </div>
    </>
  );
}

export default Login;
