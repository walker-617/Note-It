import { async } from "@firebase/util";
import React, { useState, useRef, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

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

function TitlePage({
  username,
  setPage,
  title,
  setTitle,
  createdTime,
  setCreatedTime,
  titles,
  change,
  setChange,
}) {
  const gotoHome = () => {
    setPage("home");
    return;
  };

  const [editTitle, setEditTitle] = useState(false);
  const [notes, setNotes] = useState();
  const [timestamps, setTimestamps] = useState([]);
  const [changeNotes, setChangeNotes] = useState(true);

  const titleRef = useRef("");
  const noteRef = useRef("");

  const checkTitle = async (username, title) => {
    const res = await getTitles(username);
    if (res.titles?.includes(title)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, username, title), (doc) => {
      const data = doc.data();
      setNotes(data?.notes);
      setTimestamps(data?.timestamps);
      setError("");
    });

    return () => {
      unsubscribe();
    };
  }, [changeNotes, username, title]);

  const handleTitle = () => {
    setEditTitle(true);
  };

  const handleCancel = () => {
    setError("");
    setEditTitle(false);
  };

  const [error, setError] = useState("load");

  const handleUpdate = async () => {
    const check = await checkTitle(username, title);
    if (!check) {
      setError("no page");
      return;
    }
    var newTitle = titleRef.current.value;
    newTitle = newTitle.trim().replace(/\s+/g, " ");
    if (titles?.includes(newTitle)) {
      setError("exists");
      return;
    }
    if (newTitle !== "") {
      const time = getTimestamp();
      updateTitle(username, title, newTitle, createdTime, time);
      setChange(!change);
      setTitle(newTitle);
      setCreatedTime(time);
    }
    setError("");
    setEditTitle(false);
  };

  const createNote = async () => {
    const check = await checkTitle(username, title);
    if (!check) {
      setError("no page");
      return;
    }
    var note = noteRef.current.value;
    note = note.trim().replace(/\s+/g, " ");
    if (notes?.includes(note)) {
      setError("note exists");
      return;
    }
    if (note !== "") {
      const time = getTimestamp();
      addNote(username, title, note, time);
      setChangeNotes(!changeNotes);
    }
    setError("");
    noteRef.current.value = "";
  };

  const handleDelete = async () => {
    const check = await checkTitle(username, title);
    if (!check) {
      setError("no page");
      return;
    }
    deleteTitle(username, title, createdTime).then(() => {
      setChange(!change);
      setPage("home");
    });
    return;
  };

  const handleClick = () => {
    setError("");
  };

  return (
    <div className="home">
      <div className="top">
        <FaHome className="homeIcon" onClick={gotoHome} />
        {error === "no page" ? (
          <span className="title-exists" align="center">
            Page not found.
          </span>
        ) : (
          ""
        )}
        <FaTrash className="homeIcon" onClick={handleDelete} />
      </div>
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
              onClick={handleUpdate}
            />
            <span style={{ margin: "10px" }}></span>
            <input
              type="submit"
              value="Cancel"
              className="button"
              onClick={handleCancel}
            />
            {error === "exists" ? (
              <span className="title-exists" align="center">
                Title already exists
              </span>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div className="title">
            {title} <FaPen className="editIcon" onClick={handleTitle} />
            <span className="createdTime">
              <i>{createdTime}</i>
            </span>
          </div>
        )}
        <br></br>
        <textarea
          ref={noteRef}
          className="new-note"
          placeholder="New note"
          onClick={handleClick}
        ></textarea>
        <div style={{ margin: "-20px" }}></div>
        <input
          type="submit"
          value="Create"
          className="button"
          onClick={createNote}
        />
        {error === "note exists" ? (
          <span className="title-exists" align="center">
            Note already exists
          </span>
        ) : (
          ""
        )}
        <br></br>
        <br></br>
        <span className="old-notes">Old notes :</span>
        {error === "load" ? <div align="center">Loading...</div> : ""}
        {notes?.map((note, index) => (
          <Note
            key={timestamps[notes.length - index - 1]}
            username={username}
            title={title}
            note={notes[notes.length - index - 1]}
            timestamp={timestamps[notes.length - index - 1]}
            notes={notes}
            changeNotes={changeNotes}
            setChangeNotes={setChangeNotes}
          />
        ))}
      </div>
      <div style={{ margin: "50px" }}></div>
    </div>
  );
}

function Note({
  username,
  title,
  note,
  timestamp,
  notes,
  changeNotes,
  setChangeNotes,
}) {
  const [editNote, setEditNote] = useState(false);
  const [error, setError] = useState(false);
  const noteRef = useRef("");

  const handleNote = () => {
    setEditNote(true);
  };

  const handleCancel = () => {
    setError(false);
    setEditNote(false);
  };

  const _deleteNote = () => {
    deleteNote(username, title, note, timestamp);
    setChangeNotes(!changeNotes);
    setEditNote(false);
    return;
  };

  const handleEdit = () => {
    var newNote = noteRef.current.value;
    newNote = newNote.trim().replace(/\s+/g, " ");
    if (notes?.includes(newNote)) {
      setError(true);
      return;
    }
    const newTime = getTimestamp();
    if (newNote !== "") {
      setChangeNotes(!changeNotes);
      updateNote(username, title, note, timestamp, newNote, newTime);
    }
    setEditNote(false);
    return;
  };

  const handleClick = () => {
    setError("");
  };

  return (
    <>
      {editNote ? (
        <div className="total-note" align="end">
          <textarea
            ref={noteRef}
            className="edit-note"
            placeholder={note}
            onClick={handleClick}
            defaultValue={note}
          ></textarea>
          <FaTrash className="deleteNote" onClick={_deleteNote} />
          <div style={{ margin: "-20px" }}></div>
          {error ? (
            <span className="title-exists" align="center">
              Note already exists
            </span>
          ) : (
            ""
          )}
          <input
            type="submit"
            value="Update"
            className="button"
            onClick={handleEdit}
          />
          <span style={{ margin: "10px" }}></span>
          <input
            type="submit"
            value="Cancel"
            className="button"
            onClick={handleCancel}
          />
          <br></br>
          <br></br>
        </div>
      ) : (
        <div className="total-note" align="end" onClick={handleNote}>
          <div className="timestamp" align="end">
            <i>{timestamp}</i>
          </div>
          <div className="title-page-note" style={{ textAlign: "start" }}>
            <span className="note-text">{note}</span>
          </div>
        </div>
      )}
    </>
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
