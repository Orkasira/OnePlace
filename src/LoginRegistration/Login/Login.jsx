import React, { useState } from "react";
import "./Login.css";
import photo from "../../assets/62bc5492a876268b6b9fc395f006a9259cafde47.png";
import { Link, useNavigate } from "react-router-dom";
import eyeview from "../../assets/eyeview.png";
import eyehide from "../../assets/eyehide.png";
import defaultphoto from "../../assets/defaultphoto.jpg";

function Login({ onLogin }) {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations

    let valid = true;

    if (!form.email.includes("@")) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (form.password.length < 3) {
      setPasswordError("Password must be at least 3 characters");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    // request to the API

    try {
      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);

      const res = await fetch(
        "https://oneplace-production-0q4o50.laravel.cloud/api/login",
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: formData,
        },
      );

      const data = await res.json();

      console.log(data);

      if (res.status === 200) {
        const loggedUser = {
          username: form.email.split("@")[0],
          email: data.email,
          photo: data.profile_photo || defaultphoto,
        };

        onLogin(loggedUser);
        navigate("/ProductPage");
      } else {
        alert("Login failed. Please check your Email or password.");
      }

      console.log(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // toggle password visibility

  function togglePassword() {
    setShow(!show);
  }

  return (
    <>
      <div className="login-container">
        <div className="photo-container">
          <img src={photo} alt="photo" className="photo" />
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <h1 className="login-title">Log in</h1>

          <div className="form-inputs-container">
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Email or username *"
                onChange={handleChange}
                value={form.email}
                className="emailInput"
              />

              {emailError && (
                <div className="validation-errors">{emailError}</div>
              )}

              <div className="passwordInputToggle">
                <div className="password-container">
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    placeholder="Password *"
                    onChange={handleChange}
                    value={form.password}
                    className="passInput"
                  />

                  <span onClick={togglePassword}>
                    {show ? (
                      <img src={eyeview} alt="eye" className="eye" />
                    ) : (
                      <img src={eyehide} alt="eye" className="eye" />
                    )}
                  </span>
                </div>

                {passwordError && (
                  <div className="pass-validation-errors">{passwordError}</div>
                )}
              </div>
            </div>

            <button className="login-btn">Log in</button>

            <p className="register-link-container">
              Not a member?{" "}
              <Link to="/Registration" className="register-link-content">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
