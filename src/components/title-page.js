import React, { useState, useRef, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { IoIosCopy } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Back from "./back";
import { getTimestamp } from "../utils";

import {
  addNote,
  deleteNote,
  updateNote,
  updateTitle,
  onSnapshot,
  doc,
  db,
  checkPageAndTitle,
  deleteTitle,
} from "../auth";

function TitlePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const titleRef = useRef("");
  const newNoteRef = useRef("");
  const updateNoteRef = useRef("");

  const [editNotes, setEditNotes] = useState([]);
  const [editTitle, setEditTitle] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState();
  const [title, setTitle] = useState("");
  const [t_timestamp, setT_timestamp] = useState("");

  useEffect(() => {
    if (location.state?.title && location.state?.time) {
      setTitle(location.state?.title);
      setT_timestamp(location.state?.time);
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    let unsubscribe;
    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
        if (title) {
          unsubscribe = onSnapshot(doc(db, user.email, title), (doc) => {
            setNotes(doc.data()?.notes ?? []);
            setLoading(false);
            setEditNotes(new Array(doc.data()?.notes.length).fill(false));
          });
        }
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
  }, [title]);

  function validateDocumentName(name) {
    if (!name.trim()) {
      return "title cannot be empty";
    }

    if (/^[0-9]/.test(name)) {
      return "title cannot start with a number";
    }

    if (!/^[a-zA-Z_$][a-zA-Z0-9 _$]*$/.test(name)) {
      return "title must consist of alphanumerics, spaces, '_', and '$'";
    }

    if (name.length >= 1000) {
      return "title must be less than 1,000 characters";
    }
    return "title is valid";
  }

  async function handleUpdateTitle() {
    var newTitle = titleRef.current.value;
    newTitle = newTitle.trim().replace(/\s+/g, " ");

    const x = validateDocumentName(newTitle);
    if (x !== "title is valid") {
      setError(x);
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const [page, titleExists] = await checkPageAndTitle(email, title, newTitle);

    if (!page) {
      setError("Page not found");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    if (newTitle === title) {
      setError("Same title");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    if (titleExists) {
      setError("Title already exists");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    const time = getTimestamp();
    updateTitle(email, title, newTitle, t_timestamp, time);
    setEditTitle(false);
    setTitle(newTitle);
    setT_timestamp(time);
    setError("");
    setEditTitle(false);
    navigate("/title-page", {
      state: { title: newTitle, timestamp: time },
      replace: true,
    });
  }

  function handleCancel() {
    setEditTitle(false);
    setError("");
  }

  async function createNote() {
    const [page, titleExists] = await checkPageAndTitle(email, title, "");
    if (!page) {
      setError("Page not found");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    var note = newNoteRef.current.value;
    note = note.trim().replace(/[ \t]+/g, " ");
    if (note === "") {
      setError("note cannot be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    let noteExists = false;
    for (let x of notes) {
      if (x["note"] === note) {
        noteExists = true;
        break;
      }
    }

    if (noteExists) {
      setError("note already exists");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const time = getTimestamp();
    addNote(email, title, note, time);
    setError("");
    newNoteRef.current.value = "";
  }

  async function handleUpdateNote(oldNote, oldTimestamp) {
    const [page, titleExists] = await checkPageAndTitle(email, title, "");
    if (!page) {
      setError("Page not found");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    var newNote = updateNoteRef.current.value;
    newNote = newNote.trim().replace(/[ \t]+/g, " ");
    if (newNote === "") {
      setError("note cannot be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    if (oldNote === newNote) {
      setError("same note");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    let noteExists = false;
    for (let x of notes) {
      if (x["note"] === newNote) {
        noteExists = true;
        break;
      }
    }

    if (noteExists) {
      setError("note already exists");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }

    const time = getTimestamp();
    updateNote(email, title, oldNote, oldTimestamp, newNote, time);
    setError("");
    updateNoteRef.current.value = "";
  }

  async function _deleteNote(note, timestamp) {
    const [page, titleExists] = await checkPageAndTitle(email, title, "");
    if (!page) {
      setError("Page not found");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    deleteNote(email, title, note, timestamp);
  }

  async function _deleteTitle() {
    const [page, titleExists] = await checkPageAndTitle(email, title, "");
    if (!page) {
      setError("Page not found");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    deleteTitle(email, title, t_timestamp);
    navigate("/home", { replace: true });
  }

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

  const copyNote = (note) => {
    navigator.clipboard.writeText(note);
  };

  return (
    <>
      <Back />
      <div className="title-page">
        {error ? <div className="error">{error}</div> : ""}
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
                handleUpdateTitle();
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
          <>
            <div className="title">
              <div className="title-name-edit">{title}</div>
              <span className="createdTime">
                <i>{t_timestamp}</i>
              </span>
            </div>
            <div>
              <FaPen className="editIcon" onClick={() => setEditTitle(true)} />
              <FaTrash className="editIcon" onClick={() => _deleteTitle()} />
            </div>
          </>
        )}
        <br></br>
        <textarea
          ref={newNoteRef}
          className="new-note"
          placeholder="New note"
        ></textarea>
        <div style={{ margin: "-20px" }}></div>
        <input
          type="submit"
          value="Create"
          className="button"
          onClick={() => createNote()}
        />
        <br></br>
        <br></br>
        <span className="old-notes">Old notes :</span>
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
          notes?.map((note, index) => (
            <div
              className="total-note"
              key={notes[notes.length - index - 1].timestamp}
              align="end"
            >
              {editNotes[notes.length - index - 1] ? (
                <>
                  <textarea
                    ref={updateNoteRef}
                    className="edit-note"
                    placeholder="Note cannot be empty"
                    defaultValue={notes[notes.length - index - 1].note}
                  ></textarea>
                  <FaTrash
                    className="deleteNote"
                    onClick={() => {
                      _deleteNote(
                        notes[notes.length - index - 1].note,
                        notes[notes.length - index - 1].timestamp
                      );
                    }}
                  />
                  <div style={{ margin: "-20px" }}></div>
                  <input
                    type="submit"
                    value="Update"
                    className="button"
                    onClick={() =>
                      handleUpdateNote(
                        notes[notes.length - index - 1].note,
                        notes[notes.length - index - 1].timestamp
                      )
                    }
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
                  <div>
                    <div
                      className="title-page-note"
                      style={{ textAlign: "start" }}
                      onClick={() => toggleEditNote(notes.length - index - 1)}
                    >
                      <span className="note-text">
                        {notes[notes.length - index - 1].note}
                      </span>
                    </div>

                    <IoIosCopy
                      className="copyNote"
                      onClick={() =>
                        copyNote(notes[notes.length - index - 1].note)
                      }
                    />
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      {notes && notes.length === 0 ? (
        <div align="center" style={{ margin: "20px" }}>
          No old notes
        </div>
      ) : (
        ""
      )}
      <div style={{ margin: "50px" }}></div>
    </>
  );
}

export default TitlePage;
