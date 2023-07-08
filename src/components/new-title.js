import React, { useRef, useState } from "react";
import { FaHome } from "react-icons/fa";
import { addTitle } from "../auth";

function NewTitle({
  username,
  setPage,
  setTitle,
  titles,
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
    const title = titleRef.current.value;
    if (titles?.includes(title)) {
      setError("exists");
      return;
    }
    const time = getTimestamp();
    addTitle(username, title, time);
    setTitle(title);
    setChange(!change);
    setPage("titlePage");
    setCreatedTime(time);
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

function getTimestamp() {
  const currentDate = new Date();

  const options = { hour: "numeric", minute: "numeric", second: "numeric" };
  const currentTime = currentDate.toLocaleString("en-US", options);

  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("en-US", { month: "long" });
  const year = currentDate.getFullYear();
  const ordinalSuffix = getOrdinalSuffix(day);

  const formattedDateString = day + ordinalSuffix + " " + month + " " + year;

  return currentTime + ", " + formattedDateString;
}

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export default NewTitle;
