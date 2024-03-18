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
  getTitles,
} from "../auth";

function TitlePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const titleRef = useRef("");
  const noteRef = useRef("");

  const [notes, setNotes] = useState([]);
  const [changeNotes, setChangeNotes] = useState(true);
  const [editNote, setEditNote] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [Loading, setLoading] = useState(true);
  
  const [title,setTitle] = useState(location.state.title);
  const [t_timestamp,setT_timestamp] = useState(location.state.timestamp);

  useEffect(() => {
    let unsubscribe;

    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        unsubscribe = onSnapshot(doc(db, user.email, title), (doc) => {
          setNotes(doc.data().notes);
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

  // const handleTitle = () => {
  //   setEditTitle(true);
  // };

  // const handleCancel = () => {
  //   setError("");
  //   setEditTitle(false);
  // };

  // const [error, setError] = useState("load");

  // const handleUpdate = async () => {
  //   const check = await checkTitle(username, title);
  //   if (!check) {
  //     setError("no page");
  //     return;
  //   }
  //   var newTitle = titleRef.current.value;
  //   newTitle = newTitle.trim().replace(/\s+/g, " ");
  //   if (titles?.includes(newTitle)) {
  //     setError("exists");
  //     return;
  //   }
  //   if (newTitle !== "") {
  //     const time = getTimestamp();
  //     updateTitle(username, title, newTitle, createdTime, time);
  //     setChange(!change);
  //     setTitle(newTitle);
  //     setCreatedTime(time);
  //   }
  //   setError("");
  //   setEditTitle(false);
  // };

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

  // const handleDelete = async () => {
  //   const check = await checkTitle(username, title);
  //   if (!check) {
  //     setError("no page");
  //     return;
  //   }
  //   deleteTitle(username, title, createdTime).then(() => {
  //     setChange(!change);
  //     setPage("home");
  //   });
  //   return;
  // };

  // const handleClick = () => {
  //   setError("");
  // };

  return (
    <div className="home">
      <div className="title-page">
        {editTitle ? (
          <div>
            <textarea
              ref={titleRef}
              className="edit-title"
              placeholder={title}
              defaultValue={title}
              required
            ></textarea>
            <div style={{ margin: "-20px" }}></div>
            <input
              type="submit"
              value="Update"
              className="button"
              // onClick={handleUpdate}
            />
            <span style={{ margin: "10px" }}></span>
            <input
              type="submit"
              value="Cancel"
              className="button"
              onClick={()=> setEditTitle(false)}
            />
            {/* {error === "exists" ? (
              <span className="title-exists" align="center">
                Title already exists
              </span>
            ) : (
              ""
            )} */}
          </div>
        ) : (
          <div className="title">
            {title}{" "}
            <FaPen
              className="editIcon"
              onClick={()=> setEditTitle(true)}
            />
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
          <div
                className="total-note"
                align="end"
              >
                <div className="timestamp" align="end">
                  <i>Loading...</i>
                </div>
                <div className="title-page-note" style={{ textAlign: "start" }}>
                  <span className="note-text">
                    Loading...
                  </span>
                </div>
              </div>
        ) : (
          notes.map((note, index) =>
            editNote ? (
              <div className="total-note" align="end">
                {/* <textarea
                ref={noteRef}
                className="edit-note"
                placeholder={note}
                // onClick={handleClick}
                defaultValue={note}
              ></textarea> */}
                {/* <FaTrash className="deleteNote"
              //  onClick={_deleteNote}
               /> */}
                {/* <div style={{ margin: "-20px" }}></div> */}
                {/* {error ? (
                <span className="title-exists" align="center">
                  Note already exists
                </span>
              ) : (
                ""
              )} */}
                {/* <input
                type="submit"
                value="Update"
                className="button"
                // onClick={handleEdit}
              /> */}
                {/* <span style={{ margin: "10px" }}></span> */}
                {/* <input
                type="submit"
                value="Cancel"
                className="button"
                // onClick={handleCancel}
              /> */}
                {/* <br></br> */}
                {/* <br></br> */}
              </div>
            ) : (
              <div
                className="total-note"
                align="end"
                // onClick={handleNote}
                key={notes[notes.length - index - 1].timestamp}
              >
                <div className="timestamp" align="end">
                  <i>{notes[notes.length - index - 1].timestamp}</i>
                </div>
                <div className="title-page-note" style={{ textAlign: "start" }}>
                  <span className="note-text">
                    {notes[notes.length - index - 1].note}
                  </span>
                </div>
              </div>
            )
          )
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
