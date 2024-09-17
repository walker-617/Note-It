import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo_nbg_light from "../images/logo_nbg_light.png";
import logo_nbg_dark from "../images/logo_nbg_dark.png";

function Header({ mode, setMode }) {
  const [imageURL, setImageURL] = useState(logo_nbg_dark);

  useEffect(() => {
    if (mode === "light") {
      setImageURL(logo_nbg_dark);
    } else {
      setImageURL(logo_nbg_light);
    }
  }, [mode]);

  function changeModeTo(mode_) {
    localStorage.setItem("mode", mode_);
    setMode(mode_);
  }

  return (
    <div className="header">
      <span className="header-letter">N</span>
      {mode === "dark" ? (
        <img
          src={imageURL}
          alt="App Logo"
          className="header-image"
          onClick={() => changeModeTo("light")}
          onMouseOver={() => setImageURL(logo_nbg_dark)}
          onMouseOut={() => setImageURL(logo_nbg_light)}
        />
      ) : (
        <img
          src={imageURL}
          alt="App Logo"
          className="header-image"
          onClick={() => changeModeTo("dark")}
          onMouseOver={() => setImageURL(logo_nbg_light)}
          onMouseOut={() => setImageURL(logo_nbg_dark)}
        />
      )}
      <span className="header-letter">TE IT</span>
    </div>
  );
}

export default Header;
