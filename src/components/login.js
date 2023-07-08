import React, { useRef, useState } from "react";
import { checkUser } from "../auth";

function Login({ setPage, setUsername }) {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState();

  const verifyUser = (event) => {
    event.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    checkUser(username, password).then((res) => {
      if (res === "user not found" || res === "incorrect password") {
        setError(res);
        return;
      }
      setUsername(username);
      setPage("home");
      return;
    });
  };

  return (
    <>
      <form onSubmit={verifyUser}>
        <div align="center" className="login">
          <input
            ref={usernameRef}
            type="text"
            placeholder="username"
            className="username"
            required
          />
          <br />
          <br />
          <input
            ref={passwordRef}
            type="password"
            placeholder="password"
            className="password"
            required
          />
          <br />
          <input type="submit" value="Login" className="button" />
        </div>
      </form>
      <br></br>
      <div style={{ color: "red" }} align="center">
        {error}
      </div>
    </>
  );
}

export default Login;
