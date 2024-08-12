import "./App.css";
import "./New.css"
import Login from "./components/login";
import Home from "./components/home";
import NewTitle from "./components/new-title";
import TitlePage from "./components/title-page";
import Account from "./components/account";
import Header from "./components/header";
import Error from "./components/ErrorNotFound";

import { onSnapshot, doc, db } from "./auth";

import React, { useState, useEffect } from "react";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";

function App() {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    const mode_ = localStorage.getItem("mode");
    if (mode_) {
      setMode(mode_);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    document.querySelector(
      "link[rel='shortcut icon']"
    ).href = `/logo_nbg_${mode}.png`;

    document.querySelector("link[rel='icon']").href = `/logo_nbg_${mode}.png`;

    document.querySelector(
      "link[rel='apple-touch-icon']"
    ).href = `/logo_nbg_${mode}.png`;

    if (mode === "dark") {
      root.style.setProperty("--main-color", "black");
      root.style.setProperty("--opp-color", "white");
    } else {
      root.style.setProperty("--main-color", "white");
      root.style.setProperty("--opp-color", "black");
    }
  }, [mode]);

  return (
    <div className="home">
      <BrowserRouter>
        <Account mode={mode} setMode={setMode} />
        <Header mode={mode} setMode={setMode} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/new-title" element={<NewTitle />} />
          <Route path="/title-page" element={<TitlePage />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
