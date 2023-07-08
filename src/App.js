import "./App.css";
import Login from "./components/login";
import React, { useState, useEffect } from "react";
import Home from "./components/home";
import NewTitle from "./components/new-title";
import TitlePage from "./components/title-page";
import { onSnapshot, doc, db } from "./auth";

function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("o");
  const [title, setTitle] = useState();
  const [createdTime, setCreatedTime] = useState();
  const [titles, setTitles] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [change, setChange] = useState(true);
  var component;

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, username, "all_titles"), (doc) => {
      console.log(doc);
      console.log(doc.data()?.titles);
      setTitles(doc.data()?.titles);
      setTimestamps(doc.data()?.timestamps);
    });

    return () => {
      unsubscribe();
    };
  }, [username, change]);

  if (page === "home") {
    component = (
      <Home
        username={username}
        setPage={setPage}
        titles={titles}
        setTitles={setTitles}
        timestamps={timestamps}
        setTimestamps={setTimestamps}
        setTitle={setTitle}
        setCreatedTime={setCreatedTime}
      />
    );
  } else if (page === "newTitle") {
    component = (
      <NewTitle
        username={username}
        setPage={setPage}
        setTitle={setTitle}
        setCreatedTime={setCreatedTime}
        titles={titles}
        setTitles={setTitles}
        timestamps={timestamps}
        change={change}
        setChange={setChange}
      />
    );
  } else if (page === "titlePage") {
    component = (
      <TitlePage
        username={username}
        setPage={setPage}
        title={title}
        createdTime={createdTime}
        setTitle={setTitle}
        setCreatedTime={setCreatedTime}
        titles={titles}
        setTitles={setTitles}
        change={change}
        setChange={setChange}
      />
    );
  } else {
    component = <Login setPage={setPage} setUsername={setUsername} />;
  }
  return (
    <div>
      <div align="center" className="heading">
        My Notes
      </div>
      {component}
    </div>
  );
}

export default App;
