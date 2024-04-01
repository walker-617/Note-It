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

async function getTitles(email) {
  const res = await getDoc(doc(db, email, "all_titles"));
  return res.data();
}

function addNote(email, title, note, timestamp) {
  setDoc(
    doc(db, email, title),
    {
      notes: arrayUnion({ note, timestamp }),
    },
    { merge: true }
  );
}

function deleteNote(email, title, note, timestamp) {
  setDoc(
    doc(db, email, title),
    {
      notes: arrayRemove({ note, timestamp }),
    },
    { merge: true }
  );
}

function updateNote(
  email,
  title,
  oldNote,
  oldTimestamp,
  newNote,
  newTimestamp
) {
  deleteNote(email, title, oldNote, oldTimestamp);
  addNote(email, title, newNote, newTimestamp);
}

function addTitle(email, title, timestamp, data = {notes:[]}) {
  setDoc(doc(db, email, title), data, { merge: true });
  setDoc(
    doc(db, email, "all_titles"),
    {
      titles: arrayUnion({ title, timestamp }),
    },
    { merge: true }
  );
}

function deleteTitle(email, title, timestamp) {
  deleteDoc(doc(db, email, title));
  setDoc(
    doc(db, email, "all_titles"),
    {
      titles: arrayRemove({ title, timestamp }),
    },
    { merge: true }
  );
}

function updateTitle(email, oldTitle, newTitle, oldTimestamp, newTimestamp) {
  getDoc(doc(db, email, oldTitle)).then((data) => {
    deleteTitle(email, oldTitle, oldTimestamp);
    addTitle(email, newTitle, newTimestamp, data.data());
  });
}

async function deleteAllTitles(email){
    const data = await getTitles(email);
    for (let title of data.titles) {
      deleteTitle(email,title["title"],title["timestamp"]);
    }
    return "deleted";
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

export {
  db,
  doc,
  getTitles,
  addNote,
  deleteNote,
  updateNote,
  addTitle,
  deleteTitle,
  updateTitle,
  onSnapshot,
  checkPageAndTitle,
  deleteAllTitles
};
