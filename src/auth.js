import { initializeApp } from "firebase/app";

import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { config } from "./config";

const firebaseConfig = config;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const checkUser = async (username, password) => {
  const res = await getDoc(doc(db, username, "auth"));
  if (!res.exists()) {
    return "user not found";
  }
  const user = res.data();
  if (password !== user.password) {
    return "incorrect password";
  }
};

const getTitles = async (username) => {
  const res = await getDoc(doc(db, username, "all_titles"));
  return res.data();
};

const getNotes = (username, title) => getTitleData(username, title);

const getTitleData = async (username, title) => {
  const res = await getDoc(doc(db, username, title));
  if (!res.exists()) {
    return "not found";
  }
  return res.data();
};

const addTitle = async (username, title, timestamp) => {
  const res = await setDoc(doc(db, username, title), {}).then(() => {
    setDoc(
      doc(db, username, "all_titles"),
      {
        titles: arrayUnion(title),
        timestamps: arrayUnion(timestamp),
      },
      { merge: true }
    );
  });
};

const addNote = async (username, title, note, timestamp) => {
  const res = await setDoc(
    doc(db, username, title),
    {
      notes: arrayUnion(note),
      timestamps: arrayUnion(timestamp),
    },
    { merge: true }
  );
};

const deleteTitle = async (username, title, timestamp) => {
  const res = await deleteDoc(doc(db, username, title));
  setDoc(
    doc(db, username, "all_titles"),
    {
      titles: arrayRemove(title),
      timestamps: arrayRemove(timestamp),
    },
    { merge: true }
  );
};

const deleteNote = async (username, title, note, timestamp) => {
  const res = await setDoc(
    doc(db, username, title),
    {
      notes: arrayRemove(note),
      timestamps: arrayRemove(timestamp),
    },
    { merge: true }
  );
};

const updateTitle = async (
  username,
  oldTitle,
  newTitle,
  oldTimestamp,
  newTimestamp
) => {
  const data = await getDoc(doc(db, username, oldTitle));
  deleteTitle(username, oldTitle, oldTimestamp);
  addTitle(username, newTitle, newTimestamp);
  setDoc(doc(db, username, newTitle), data.data(), { merge: true });
};

const updateNote = (
  username,
  title,
  oldNote,
  oldTimestamp,
  newNote,
  newTimestamp
) => {
  deleteNote(username, title, oldNote, oldTimestamp);
  addNote(username, title, newNote, newTimestamp);
};

export {
  checkUser,
  getTitles,
  getTitleData,
  getNotes,
  addTitle,
  addNote,
  deleteTitle,
  deleteNote,
  updateTitle,
  updateNote,
  onSnapshot,
  doc,
  db,
};
