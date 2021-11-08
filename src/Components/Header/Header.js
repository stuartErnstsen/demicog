import LogoTitle from "./LogoTitle/LogoTitle";
import CommentNotification from "./CommentNotification/CommentNotification";
import Login from "./UserNavigation/UserNavigation";
import "./Header.css";

const Header = (props) => {
  return (
    <header>
      <LogoTitle />
      <Login />
      <CommentNotification />
    </header>
  );
};

export default Header;
