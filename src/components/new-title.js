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
      }
      else{
        navigate("/", { replace:true });
      }
    });

    return () => {
      authStateChanged();
    };
  }, []);

  async function handleSubmit() {
    setError("load");
    const title = titleRef.current.value;
    const [page, titleExists] = await checkPageAndTitle(email, "", title);
    if (titleExists) {
      setError("exists");
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
        {error === "exists" ? (
          <div style={{ color: "red" }} align="center">
            Title already exists
          </div>
        ) : (
          ""
        )}
        {error === "load" ? <div align="center">Loading...</div> : ""}
      </div>
    </>
  );
}

export default NewTitle;
