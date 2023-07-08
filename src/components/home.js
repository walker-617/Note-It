import React, { useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { onSnapshot, doc, db } from "../auth";

function Home({
  username,
  setPage,
  titles,
  setTitles,
  timestamps,
  setTimestamps,
  setTitle,
  setCreatedTime,
}) {
  const gotoNewTitle = () => {
    setPage("newTitle");
    return;
  };

  const gotoTitlePage = (title, timestamp) => {
    setTitle(title);
    setPage("titlePage");
    setCreatedTime(timestamp);
    return;
  };

  return (
    <div className="home">
      <div className="top"></div>
      <div className="notes">
        <div className="add" onClick={gotoNewTitle}>
          <FaPlusCircle className="addIcon" />
        </div>
        {titles?.map((title, index) => (
          <div
            className="note"
            key={titles[titles.length - index - 1]}
            onClick={() =>
              gotoTitlePage(
                titles[titles.length - index - 1],
                timestamps[titles.length - index - 1]
              )
            }
          >
            <span className="title-name">
              {titles[titles.length - index - 1]}
            </span>

            <span className="title-time">
              <i>{timestamps[titles.length - index - 1]}</i>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
