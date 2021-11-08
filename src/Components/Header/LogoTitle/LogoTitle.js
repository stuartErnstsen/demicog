import { Link } from "react-router-dom";
import demicogLogo from "../../../Assets/demicogWEB.png";

const LogoTitle = (props) => {
  return (
    <div className="header-left-container">
      <Link to="/">
        <div id="logo-container">
          <img id="header-logo" src={demicogLogo} alt="DEMICOG LOGO" />
        </div>
      </Link>
      <Link to="/">
        <h1 id="header-title">
          <span id="header-title-animation-clip">DEMI</span>COG
        </h1>
      </Link>
      <nav id="main-nav">
        <Link to="/">HOME</Link>
        <Link to={`/builds/page/${1}`} id="nav-lines">
          BUILDS
        </Link>
        <Link to="/market">MARKET</Link>
      </nav>
    </div>
  );
};

export default LogoTitle;
