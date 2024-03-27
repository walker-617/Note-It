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

async function getTitles(email){
  const res = await getDoc(doc(db, email, "all_titles"));
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

function addTitle(email, title, timestamp, data={}) {
  setDoc(doc(db, email, title), data, { merge: true });
  setDoc(
    doc(db, email, "all_titles"),
    {
      titles: arrayUnion({ title, timestamp }),
    },
    { merge: true }
  );
}

function deleteTitle(username, title, timestamp) {
  deleteDoc(doc(db, username, title));
  setDoc(
    doc(db, username, "all_titles"),
    {
      titles: arrayRemove({ title, timestamp }),
    },
    { merge: true }
  );
}

function updateTitle(email, oldTitle, newTitle, oldTimestamp, newTimestamp) {
  getDoc(doc(db, email, oldTitle)).then((data) => {
    deleteTitle(email, oldTitle,oldTimestamp);
    addTitle(email, newTitle, newTimestamp, data.data());
  });
}

async function checkPageAndTitle(email, title_, updatedTitle_) {
  const data = await getTitles(email);
  let page = false;
  let titleExists = false;
  for (let title of data.titles) {
    if (title["title"] === title_) {
      page = true;
    }
    if (title["title"] === updatedTitle_) {
      titleExists = true;
    }
  }
  return [page, titleExists];
}

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
  checkPageAndTitle
};
