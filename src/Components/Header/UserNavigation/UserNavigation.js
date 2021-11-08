import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setUser } from "../../../ducks/Reducers/userReducer";
import { setCommentFeed } from "../../../ducks/Reducers/commentReducer";
import Login from "./Login/Login";
import Register from "./Register/Register";
import axios from "axios";
import "./UserNavigation.css";

const UserNavigation = (props) => {
  const { user, setUser, setCommentFeed } = props;

  const [showLoginErr, setShowLoginErr] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [loginErrTimeout, setLoginErrTimeout] = useState();
  const [submitType, setSubmitType] = useState("login");

  useEffect(() => {
    axios
      .get("/auth/user")
      .then((res) => {
        setSubmitType("logout");
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, [setUser]);

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    if (user) {
      axios
        .get("/api/comment-feed", { cancelToken: cancelTokenSource.token })
        .then((res) => {
          console.log(res.data);
          setCommentFeed(res.data);
        })
        .catch((err) => console.log(err));
    }

    return () => {
      cancelTokenSource.cancel();
    };
  }, [user, setCommentFeed]);

  useEffect(() => {
    return () => clearTimeout(loginErrTimeout);
  }, [loginErrTimeout]);

  const loginErrAlert = (errText) => {
    setLoginErr(errText);
    setShowLoginErr(true);
    setLoginErrTimeout(
      setTimeout(() => {
        setShowLoginErr(false);
      }, 1000 * 8)
    );
  };

  const handleChangeSubmitType = () => {
    setSubmitType(submitType === "login" ? "register" : "login");
  };

  return (
    <nav className="login-nav">
      <Login
        user={user}
        submitType={submitType}
        setSubmitType={setSubmitType}
        setUser={setUser}
        loginErrAlert={loginErrAlert}
        showLoginErr={showLoginErr}
        loginErr={loginErr}
        handleChangeSubmitType={handleChangeSubmitType}
      />
      {user === null && (
        <Register
          submitType={submitType}
          setSubmitType={setSubmitType}
          setUser={setUser}
          loginErrAlert={loginErrAlert}
        />
      )}
    </nav>
  );
};

const mapStateToProps = (stateRedux) => {
  return {
    user: stateRedux.userReducer.user,
  };
};

export default connect(mapStateToProps, { setUser, setCommentFeed })(
  UserNavigation
);
