import { useState } from "react";
import axios from "axios";

const Login = (props) => {
  const {
    user,
    submitType,
    setSubmitType,
    showLoginErr,
    loginErr,
    loginErrAlert,
    setUser,
    handleChangeSubmitType,
  } = props;

  const [loginInput, setLoginInput] = useState({
    userOrEmail: "",
    password: "",
  });

  const resetInput = () => {
    setLoginInput({
      userOrEmail: "",
      password: "",
    });
  };

  const handleLoginInput = (e) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { userOrEmail, password } = loginInput;
    if (!userOrEmail || !password) {
      return loginErrAlert("Username/password required");
    }
    axios
      .post("/auth/login", { userOrEmail, password })
      .then((res) => {
        setSubmitType("logout");
        resetInput();
        setUser(res.data);
      })
      .catch((err) => {
        loginErrAlert(err.response.data);
      });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    axios
      .get("/auth/logout")
      .then((res) => {
        setSubmitType("login");
        props.setUser(null);
      })
      .catch((err) => console.log("Hit: LOGOUT ", err));
  };

  return (
    <form onSubmit={submitType === "login" ? handleLogin : handleLogout}>
      {user === null && (
        <div id="login-input-container">
          <h3
            className={`login-err ${showLoginErr ? "show-login-err" : ""} ${
              submitType === "register" ? "reg-err" : ""
            }`}
          >
            {loginErr}
          </h3>
          <input
            placeholder="EMAIL/USERNAME"
            value={loginInput.userOrEmail}
            name="userOrEmail"
            onChange={handleLoginInput}
          />
          <input
            id="password-input"
            placeholder="PASSWORD"
            value={loginInput.password}
            name="password"
            type="password"
            onChange={handleLoginInput}
          />
          <p id="reg-toggle-text" onClick={handleChangeSubmitType}>
            Register new account?
          </p>
        </div>
      )}
      <button className="login-btn-container" type="submit">
        {user ? "LOGOUT" : "LOGIN"}
      </button>
    </form>
  );
};

export default Login;
