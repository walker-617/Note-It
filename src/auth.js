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
  runTransaction,
} from "firebase/firestore";
import { config } from "./config";
import { getTimestamp } from "./get-timestamp";

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

const addTitle = async (username, title) => {
  try {
    const result = await runTransaction(db, async (transaction) => {
      const timestamp = getTimestamp();
      const docRef1 = doc(db, username, title);
      const docRef2 = doc(db, username, "all_titles");
      const docSnapshot = await transaction.get(docRef1);

      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        if (docData.titles?.includes(title)) {
          return "AE";
        }
      }

      transaction.set(docRef1, {});
      transaction.set(
        docRef2,
        {
          titles: arrayUnion(title),
          timestamps: arrayUnion(timestamp),
        },
        { merge: true }
      );
      return timestamp;
    });
    return result;
  } catch (error) {
    console.error("Error adding note");
  }
};

const addNote = async (username, title, note) => {
  try {
    const result = await runTransaction(db, async (transaction) => {
      const timestamp = getTimestamp();
      const docRef = doc(db, username, title);
      const docSnapshot = await transaction.get(docRef);

      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();

        if (docData.notes?.includes(note)) {
          return "AE";
        }
        transaction.set(
          docRef,
          {
            notes: arrayUnion(note),
            timestamps: arrayUnion(timestamp),
          },
          { merge: true }
        );

        return "Success";
      } else {
        return "AD";
      }
    });
    return result;
  } catch (error) {
    console.error("Error adding note");
  }
};

const deleteTitle = async (username, title, timestamp) => {
  try {
    const result = await runTransaction(db, async (transaction) => {
      const docRef1 = doc(db, username, title);
      const docRef2 = doc(db, username, "all_titles");
      const docSnapshot = await transaction.get(docRef1);
      if (!docSnapshot.exists()) {
        return "AD";
      }
      transaction.delete(docRef1);
      transaction.set(
        docRef2,
        {
          titles: arrayRemove(title),
          timestamps: arrayRemove(timestamp),
        },
        { merge: true }
      );
      return "success";
    });
    return result;
  } catch (error) {
    console.error("Error adding note");
  }
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

const updateTitle = async (username, oldTitle, newTitle, oldTimestamp) => {
  var res = await getTitles(username);
  var isExistOld = false;
  var isExistNew = false;
  for (var i = 0; i < res?.titles?.length; i++) {
    if (res.titles[i] === oldTitle) {
      isExistOld = true;
    }
    if (res.titles[i] === newTitle) {
      isExistNew = true;
    }
  }

  if (isExistOld === false) {
    return "AD";
  }
  if (isExistNew === true) {
    return "AE";
  }
  const newTimestamp = getTimestamp();
  const data = await getDoc(doc(db, username, oldTitle));
  const res1 = await deleteTitle(username, oldTitle, oldTimestamp);
  const res2 = await addTitle(username, newTitle, newTimestamp);
  setDoc(doc(db, username, newTitle), data.data(), { merge: true });
  return newTimestamp;
};

const updateNote = (username, title, oldNote, oldTimestamp, newNote) => {
  const newTimestamp = getTimestamp();
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
