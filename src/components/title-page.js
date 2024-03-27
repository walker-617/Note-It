import React, { useState, useRef, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import {
  addNote,
  deleteNote,
  deleteTitle,
  updateNote,
  updateTitle,
  onSnapshot,
  doc,
  db,
  checkPageAndTitle,
  getTitles,
} from "../auth";

function TitlePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const titleRef = useRef("");
  const noteRef = useRef("");

  const [editNotes, setEditNotes] = useState([]);
  const [editTitle, setEditTitle] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [t_timestamp, setT_timestamp] = useState("");

  useEffect(() => {
    setTitle(location.state.title);
    setT_timestamp(location.state.timestamp);
  }, []);

  useEffect(() => {
    let unsubscribe;
    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
        if (title) {
          unsubscribe = onSnapshot(doc(db, user.email, title), (doc) => {
            setNotes(doc.data()?.notes);
            setLoading(false);
            setEditNotes(new Array(doc.data()?.notes.length).fill(false));
          });
        }
      }
    });

    return () => {
      authStateChanged();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [title]);

  // const handleTitle = () => {
  //   setEditTitle(true);
  // };

  // const handleCancel = () => {
  //   setError("");
  //   setEditTitle(false);
  // };

  // const [error, setError] = useState("load");

  function validateDocumentName(name) {
    if (!name.trim()) {
      return "title cannot be empty.";
    }

    if (/^[0-9]/.test(name)) {
      return "title cannot start with a number.";
    }

    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
      return "title must consist of alphanumerics, '_', and '$'";
    }

    if (name.length >= 1000) {
      return "title must be less than 1,000 characters";
    }
    return "title is valid.";
  }

  async function handleUpdate() {
    var newTitle = titleRef.current.value;
    newTitle = newTitle.trim().replace(/\s+/g, " ");

    const x = validateDocumentName(newTitle);
    if (x !== "title is valid.") {
      setError(x);
      return;
    }

    const [page, titleExists] = await checkPageAndTitle(email, title, newTitle);

    if (!page) {
      setError("no page");
      return;
    }
    if (newTitle === title) {
      setError("same title");
      return;
    }
    if (titleExists) {
      setError("title already exists");
      return;
    }
    const time = getTimestamp();
    updateTitle(email, title, newTitle, t_timestamp, time);
    setEditTitle(false);
    setTitle(newTitle);
    setT_timestamp(time);
    setError("");
    setEditTitle(false);
  }

  function handleCancel() {
    setEditTitle(false);
    setError("");
  }

  // const createNote = async () => {
  //   const check = await checkTitle(username, title);
  //   if (!check) {
  //     setError("no page");
  //     return;
  //   }
  //   var note = noteRef.current.value;
  //   note = note.trim().replace(/\s+/g, " ");
  //   if (notes?.includes(note)) {
  //     setError("note exists");
  //     return;
  //   }
  //   if (note !== "") {
  //     const time = getTimestamp();
  //     addNote(username, title, note, time);
  //     setChangeNotes(!changeNotes);
  //   }
  //   setError("");
  //   noteRef.current.value = "";
  // };

  // function handleUpdate(){
  //   const check = checkTitle(email, title);
  //   if (check) {
  //     setError("title already exists");
  //     return;
  //   }
  //   // deleteTitle(email, title).then(() => {
  //   //   setChange(!change);
  //   //   setPage("home");
  //   // });
  //   return;
  // };

  // const handleClick = () => {
  //   setError("");
  // };

  function toggleEditNote(index) {
    setEditNotes((prevEditNotes) => {
      const newEditNotes = [...prevEditNotes];
      for (let i = 0; i < newEditNotes.length; i++) {
        if (i !== index) {
          newEditNotes[i] = false;
        }
      }
      newEditNotes[index] = !newEditNotes[index];
      return newEditNotes;
    });
  }
  

  return (
    <div className="home">
      <div className="title-page">
        {error ? (
          <span className="title-exists" align="center">
            {error}
          </span>
        ) : (
          ""
        )}
        {editTitle ? (
          <div>
            <textarea
              ref={titleRef}
              className="edit-title"
              placeholder="title cannot be empty"
              defaultValue={title}
              required
            ></textarea>
            <div style={{ margin: "-20px" }}></div>
            <input
              type="submit"
              value="Update"
              className="button"
              onClick={() => {
                handleUpdate();
              }}
            />
            <span style={{ margin: "10px" }}></span>
            <input
              type="submit"
              value="Cancel"
              className="button"
              onClick={() => {
                handleCancel();
              }}
            />
          </div>
        ) : (
          <div className="title">
            {title}{" "}
            <FaPen className="editIcon" onClick={() => setEditTitle(true)} />
            <span className="createdTime">
              <i>{t_timestamp}</i>
            </span>
          </div>
        )}
        <br></br>
        <textarea
          ref={noteRef}
          className="new-note"
          placeholder="New note"
          // onClick={handleClick}
        ></textarea>
        <div style={{ margin: "-20px" }}></div>
        <input
          type="submit"
          value="Create"
          className="button"
          // onClick={createNote}
        />
        {/* {error === "note exists" ? (
          <span className="title-exists" align="center">
            Note already exists
          </span>
        ) : (
          ""
        )} */}
        <br></br>
        <br></br>
        <span className="old-notes">Old notes :</span>
        {/* {error === "load" ? <div align="center">Loading...</div> : ""} */}
        {Loading ? (
          <div className="total-note" align="end">
            <div className="timestamp" align="end">
              <i>Loading...</i>
            </div>
            <div className="title-page-note" style={{ textAlign: "start" }}>
              <span className="note-text">Loading...</span>
            </div>
          </div>
        ) : (
          notes.map((note, index) => (
            <div
              className="total-note"
              key={notes[notes.length - index - 1].timestamp}
              align="end"
            >
              {editNotes[notes.length - index - 1] ? (
                <>
                  <textarea
                    ref={noteRef}
                    className="edit-note"
                    placeholder="Note cannot be empty"
                    defaultValue={notes[notes.length - index - 1].note}
                  ></textarea>
                  <FaTrash
                    className="deleteNote"
                    //  onClick={_deleteNote}
                  />
                  <div style={{ margin: "-20px" }}></div>
                  <input
                    type="submit"
                    value="Update"
                    className="button"
                    // onClick={handleEdit}
                  />
                  <span style={{ margin: "10px" }}></span>
                  <input
                    type="submit"
                    value="Cancel"
                    className="button"
                    onClick={() => toggleEditNote(notes.length - index - 1)}
                  />
                  <br></br>
                  <br></br>
                </>
              ) : (
                <>
                  <div className="timestamp" align="end">
                    <i>{notes[notes.length - index - 1].timestamp}</i>
                  </div>
                  <div
                    className="title-page-note"
                    style={{ textAlign: "start" }}
                    onClick={() => toggleEditNote(notes.length - index - 1)}
                  >
                    <span className="note-text">
                      {notes[notes.length - index - 1].note}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      <div style={{ margin: "50px" }}></div>
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

export default TitlePage;
