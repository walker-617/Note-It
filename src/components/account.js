import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import logo_nbg_light from "../images/logo_nbg_light.png";
import logo_nbg_dark from "../images/logo_nbg_dark.png";
import { onSnapshot, doc, db, deleteAllTitles } from "../auth";
import { FaTrash } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { BiSolidSun } from "react-icons/bi";
import { BiSolidMoon } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { RiLoader3Fill } from "react-icons/ri";

function Account({ mode, setMode }) {
  const [imageURL, setImageURL] = useState(logo_nbg_light);
  const [openPopup, setOpenPopup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(0);

  const [show, setShow] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe;
    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        setShow(true);
        setImageURL(user.photoURL);
        console.log(user.photoURL);
        setName(user.displayName);
        setEmail(user.email);
        unsubscribe = onSnapshot(doc(db, user.email, "all_titles"), (doc) => {
          setCount(doc.data()?.titles?.length ?? 0);
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

  function signOut() {
    getAuth()
      .signOut()
      .then(() => {
        setOpenPopup(false);
        setShow(false);
        navigate("/", { replace: true });
      });
  }

  function changeModeTo(mode_) {
    localStorage.setItem("mode", mode_);
    setMode(mode_);
  }

  function deleteAllTitles_() {
    setDeleting(true);
    deleteAllTitles(email).then(() => {
      setDeleting(false);
      setOpenPopup(false);
      navigate("/home", { replace: true });
    });
  }

  return (
    <>
      {show ? (
        <>
          <div className="account">
            <img
              src={imageURL}
              alt="Go to profile"
              className="user-image"
              onClick={() => setOpenPopup(true)}
            />
          </div>
          {openPopup ? (
            <>
              <div
                className="popup-background"
                onClick={() => setOpenPopup(false)}
              ></div>
              <div className="account-popup">
                <div className="top-container">
                  <img
                    src={imageURL}
                    alt="Profile"
                    className="user-image-popup"
                  />
                  <MdOutlineLogout
                    className="logout"
                    onClick={() => signOut()}
                  />
                  {mode === "dark" ? (
                    <BiSolidMoon
                      className="dark-mode"
                      onClick={() => changeModeTo("light")}
                    />
                  ) : (
                    <BiSolidSun
                      className="light-mode"
                      onClick={() => changeModeTo("dark")}
                    />
                  )}
                </div>
                <div className="bottom-container">
                  <div className="user-name">{name.toUpperCase()}</div>
                  <div className="user-email">{email}</div>
                  <div className="num-notes" style={{ color: "white" }}>
                    <div>Titles count</div>
                    <div>{count}</div>
                  </div>
                  {!deleting ? (
                    <div
                      className="delete-all"
                      style={count ? {} : { cursor: "not-allowed" }}
                      onClick={() => (count ? deleteAllTitles_() : "")}
                    >
                      <FaTrash className="delete-all-icon" />
                      <div>Delete all titles</div>
                    </div>
                  ) : (
                    <div className="delete-all">
                      <RiLoader3Fill className="delete-all-icon" />
                      <div>Deleting...</div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Account;
