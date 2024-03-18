import React, { useEffect, useState } from "react";
import { onSnapshot, doc, db } from "../auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { FaPlusCircle } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const [titles, setTitles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        unsubscribe = onSnapshot(doc(db, user.email, "all_titles"), (doc) => {
          setTitles(doc.data().titles);
          setLoading(false);
        });
      }
    });

    return () => {
      authStateChanged();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // const gotoNewTitle = () => {
  //   navigate("/new-title")
  // };

  const gotoTitlePage = (title, timestamp) => {
    navigate("/title-page", { state: { title, timestamp } });
    return;
  };

  return (
    <div className="home">
      <div className="top"></div>
      <div className="notes">
        <div className="add">
          <FaPlusCircle className="addIcon" />
        </div>
        {loading ? (
          <div className="note">
            <span className="title-name">Loading...</span>

            <span className="title-time">
              <i>Loading...</i>
            </span>
          </div>
        ) : (
          titles.map((title, index) => (
            <div
              className="note"
              key={titles[titles.length - index - 1].title}
              onClick={() =>
                gotoTitlePage(
                  titles[titles.length - index - 1].title,
                  titles[titles.length - index - 1].timestamp
                )
              }
            >
              <span className="title-name">
                {titles[titles.length - index - 1].title}
              </span>
              <span className="title-time">
                <i>{titles[titles.length - index - 1].timestamp}</i>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
