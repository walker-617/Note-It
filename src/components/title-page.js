import React, { useState, useRef, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

// import { getTimestamp } from "../get-timestamp";

import {
  addNote,
  deleteNote,
  deleteTitle,
  updateNote,
  updateTitle,
  onSnapshot,
  doc,
  db,
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
    var newTitle = titleRef.current.value;
    newTitle = newTitle.trim().replace(/\s+/g, " ");
    if (newTitle !== "") {
      const res = await updateTitle(username, title, newTitle, createdTime);
      if (res === "AE") {
        setError("title exists");
        return;
      }
      if (res === "AD") {
        setError("no page");
        return;
      }
      setTitle(newTitle);
      setCreatedTime(res);
      setChange(!change);
    }
    setError("");
    setEditTitle(false);
  };

  const createNote = async () => {
    var note = noteRef.current.value;
    note = note.trim().replace(/\s+/g, " ");
    if (note !== "") {
      const res = await addNote(username, title, note);
      if (res === "AE") {
        setError("note exists");
        return;
      }
      if (res === "AD") {
        setError("no page");
        return;
      }
      setChangeNotes(!changeNotes);
    }
    setError("");
    noteRef.current.value = "";
  };

  const handleDelete = async () => {
    const res = await deleteTitle(username, title, createdTime);
    if (res === "AD") {
      setError("no page");
      return;
    }
    setChange(!change);
    setPage("home");
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
              onClick={createNote}
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
            {error === "title exists" ? (
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
        {error === "try again" ? (
          <span className="title-exists" align="center"></span>
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
            timestamps={timestamps}
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
  timestamps,
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
    return;
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
    if (newNote !== "") {
      updateNote(username, title, note, timestamp, newNote);
      setChangeNotes(!changeNotes);
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

export default TitlePage;
