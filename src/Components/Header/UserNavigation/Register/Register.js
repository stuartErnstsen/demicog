import { useState } from "react";
import axios from "axios";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

const Register = (props) => {
  const { submitType, setSubmitType, loginErrAlert, setUser } = props;

  const [registerInput, setRegisterInput] = useState({
    username: "",
    email: "",
    verifyEmail: "",
    password: "",
    verifyPassword: "",
    country: "",
    region: "",
    profileImg: "",
  });

  const handleRegisterInput = (e) => {
    setRegisterInput({ ...registerInput, [e.target.name]: e.target.value });
  };

  const resetInput = () => {
    setRegisterInput({
      username: "",
      email: "",
      verifyEmail: "",
      password: "",
      verifyPassword: "",
      country: "",
      region: "",
      profileImg: "",
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    for (let key in registerInput) {
      if (!registerInput[key]) {
        return loginErrAlert(`${key} IS REQUIRED`);
      }
      if (key === "username") {
        const regEx = /^[a-zA-Z0-9-]{4,20}$/;
        if (!registerInput[key].match(regEx)) {
          return loginErrAlert(
            "USERNAME MUST BE 4-20 CHARACTERS LONG AND NOT INCLUDE ANY SPECIAL CHARACTERS"
          );
        }
      }
      if (key === "email") {
        const regEx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (!registerInput[key].match(regEx)) {
          return loginErrAlert("INVALID EMAIL: (example@email.com)");
        }
        if (registerInput.email !== registerInput.verifyEmail) {
          return loginErrAlert("EMAILS DO NOT MATCH");
        }
      }
      if (key === "password") {
        const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!registerInput[key].match(regEx)) {
          return loginErrAlert(
            "Passwword must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
          );
        }
        if (registerInput.password !== registerInput.verifyPassword) {
          return loginErrAlert("PASSWORDS DO NOT MATCH");
        }
      }
    }
    axios
      .post("/auth/register", { ...registerInput })
      .then((res) => {
        setSubmitType("logout");
        resetInput();
        setUser(res.data);
      })
      .catch((err) => {
        loginErrAlert(err.response.data);
      });
  };

  return (
    <div
      id="reg-section-container"
      className={submitType === "register" ? "show-reg-input" : ""}
    >
      <div id="reg-input-container">
        <input
          required
          pattern="[a-z0-9-].{4,20}"
          title="4-20 regular characters"
          placeholder="*USERNAME"
          value={registerInput.username}
          name="username"
          onChange={handleRegisterInput}
        />
        <input
          required
          type="email"
          //   pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          placeholder="*EMAIL"
          value={registerInput.email}
          name="email"
          onChange={handleRegisterInput}
        />
        <input
          required
          placeholder="*RE-ENTER EMAIL"
          value={registerInput.verifyEmail}
          name="verifyEmail"
          onChange={handleRegisterInput}
        />
        <input
          required
          type="password"
          //   pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
          placeholder="*PASSWORD"
          value={registerInput.password}
          name="password"
          onChange={handleRegisterInput}
        />
        <input
          required
          type="password"
          placeholder="*RE-ENTER PASSWORD"
          value={registerInput.verifyPassword}
          name="verifyPassword"
          onChange={handleRegisterInput}
        />
        <CountryDropdown
          value={registerInput.country}
          onChange={(val) =>
            setRegisterInput({ ...registerInput, country: val })
          }
        />
        <RegionDropdown
          value={registerInput.region}
          country={registerInput.country}
          onChange={(val) =>
            setRegisterInput({ ...registerInput, region: val })
          }
        />
      </div>
    </div>
  );
};

export default Register;
