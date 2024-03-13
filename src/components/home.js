import React, { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { onSnapshot, doc, db } from "../auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

function Home() {

  const navigate=useNavigate();

  const [titles,setTitles]=useState();

  useEffect(()=>{
    const user=getAuth().currentUser;
    const unsub = onSnapshot(doc(db, user.email, "titles"), (doc) => {
      console.log(doc.data());
    });

    return () => {
      unsub();
    };
  })

  const gotoNewTitle = () => {
    navigate("/new-title")
  };

  const gotoTitlePage = (title, timestamp) => {
    navigate("/title-page")
  };

  return (
    <div className="home">
      {/* <div className="top"></div>
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
      </div> */}
    </div>
  );
}

export default Home;
