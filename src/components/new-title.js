import React, { useRef, useState } from "react";
import { FaHome } from "react-icons/fa";
import { addTitle } from "../auth";

// import { getTimestamp } from "../get-timestamp";

function NewTitle({
  username,
  setPage,
  setTitle,
  titles,
  timestamps,
  setCreatedTime,
  change,
  setChange,
}) {
  const gotoHome = () => {
    setPage("home");
    return;
  };
  const [error, setError] = useState("");
  const titleRef = useRef(null);

  const handleSubmit = async (event) => {
    setError("load");
    event.preventDefault();
    var title = titleRef.current.value;
    title = title.trim().replace(/\s+/g, " ");
    const res = await addTitle(username, title);
    if (res === "AE") {
      setError("exists");
      return;
    }
    setTitle(title);
    setChange(!change);
    setPage("titlePage");
    setCreatedTime(res);
    return;
  };

  return (
    <div className="home">
      <div className="top">
        <div>
          <FaHome className="homeIcon" onClick={gotoHome} />
        </div>
      </div>
      <br></br>
      <div className="new" align="center">
        <form onSubmit={handleSubmit}>
          <input
            ref={titleRef}
            className="title-input"
            placeholder="Enter title"
            required
          />
          <br></br>
          <input type="submit" value="Create" className="button" />
        </form>
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
    </div>
  );
}

export default NewTitle;
