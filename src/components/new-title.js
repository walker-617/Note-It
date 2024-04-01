import React, { useRef, useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { addTitle, checkPageAndTitle } from "../auth";
import { getAuth } from "firebase/auth";
import { getTimestamp } from "../utils";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Back from "./back";

function NewTitle() {
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  useEffect(() => {
    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
      } else {
        navigate("/", { replace: true });
      }
    });

    return () => {
      authStateChanged();
    };
  }, []);

  function validateDocumentName(name) {
    if (!name.trim()) {
      return "title cannot be empty";
    }

    if (/^[0-9]/.test(name)) {
      return "title cannot start with a number";
    }

    if (!/^[a-zA-Z_$][a-zA-Z0-9 _$]*$/.test(name)) {
      return "title must consist of alphanumerics, spaces, '_', and '$'";
    }

    if (name.length >= 1000) {
      return "title must be less than 1,000 characters";
    }
    return "title is valid";
  }

  async function handleSubmit() {
    setError("load");
    let title = titleRef.current.value;
    title = title.trim().replace(/\s+/g, " ");

    const x = validateDocumentName(title);
    if (x !== "title is valid") {
      setError(x);
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const [page, titleExists] = await checkPageAndTitle(email, "", title);
    if (titleExists) {
      setError("title already exists");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    const time = getTimestamp();
    addTitle(email, title, time);
    navigate("/title-page", { state: { title, time }, replace: true });
  }

  return (
    <>
      <Back />
      <div className="new" align="center">
        <input
          ref={titleRef}
          className="title-input"
          placeholder="Enter title"
          required
        />
        <br></br>
        <input
          type="submit"
          value="Create"
          className="button"
          onClick={() => handleSubmit()}
        />
        <br></br>
        {error && error!=="load"? <div className="error">{error}</div> : ""}
        {error === "load" ? <div style={{backgroundColor:"var(--main-color)"}}align="center">Loading...</div> : ""}
      </div>
    </>
  );
}

export default NewTitle;
