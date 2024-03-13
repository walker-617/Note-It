import "./App.css";
import Login from "./components/login";
import Home from "./components/home";
import NewTitle from "./components/new-title";
import TitlePage from "./components/title-page";

import { onSnapshot, doc, db } from "./auth";

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/new-title" element={<NewTitle />} />
        <Route path="/title-page" element={<TitlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
