import React, { useEffect, useState } from "react";
import { onSnapshot, doc, db } from "../auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { FaPlusCircle } from "react-icons/fa";
import Header from "./header";

function Home() {
  const navigate = useNavigate();

  const [titles, setTitles] = useState();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        unsubscribe = onSnapshot(doc(db, user.email, "all_titles"), (doc) => {
          setTitles(doc.data()?.titles ?? []);
          setLoading(false);
        });
      } else {
        navigate("/", { replace: true });
      }
    });

    return () => {
      authStateChanged();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const gotoTitlePage = (title, time) => {
    navigate("/title-page", { state: { title, time } });
    return;
  };

  return (
    <div className="center">
      <div className="notes-par">
        <div className="add-new-title">
          <span style={{ alignSelf: "center" }}>Add new title?</span>
          <div className="add" onClick={() => navigate("/new-title")}>
            <FaPlusCircle className="addIcon" />
          </div>
          <span className="old-titles"> Old titles :</span>
        </div>

        <div className="notes">
          {loading ? (
            <>
              <div className="note">
                <span className="title-name">Loading...</span>

                <span className="title-time">
                  <i>Loading...</i>
                </span>
              </div>
              <div className="note">
                <span className="title-name">Loading...</span>

                <span className="title-time">
                  <i>Loading...</i>
                </span>
              </div>
            </>
          ) : (
            <>
              {titles?.map((title, index) => (
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
              ))}
            </>
          )}
          {titles && titles.length === 0 ? (
            <div align="center" style={{ margin: "20px" }}>
              No titles to show
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
