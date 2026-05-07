import "./Registration.css";
import photo from "../../assets/62bc5492a876268b6b9fc395f006a9259cafde47.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import eyeview from "../../assets/eyeview.png";
import eyehide from "../../assets/eyehide.png";
import defaultphoto from "../../assets/defaultphoto.jpg";

function Registration({ onRegister }) {
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(defaultphoto);
  const navigate = useNavigate();

  // handle input change

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // registration request // registration request //

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations
    let valid = true;

    if (form.username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      valid = false;
    } else {
      setUsernameError("");
    }

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

    if (form.password !== form.password_confirmation) {
      setConfirmError("Passwords do not match");
      valid = false;
    } else {
      setConfirmError("");
      3;
    }

    if (!valid) return;

    // request to the API

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
      if (photoFile) {
        formData.append("photo", photoFile);
      }
      const res = await fetch(
        "https://api.redseam.redberryinternship.ge/api/register",
        {
          method: "POST",
          headers: {
            accept: "application/json",
          },
          body: formData,
        },
      );

      if (!res.ok) {
        console.error("Request failed");
        return;
      }

      const data = await res.json();

      // Check for duplicate username/email error from API

      let hasError = false;
      if (data.errors && data.errors.username) {
        setUsernameError("Username is already taken");
        hasError = true;
      }
      if (data.errors && data.errors.email) {
        setEmailError("Email is already taken");
        hasError = true;
      }
      if (hasError) return;

      if (!hasError) {
        const newUser = {
          username: form.username,
          email: form.email,
          profile_photo: photoPreview,
        };

        console.log("👉 Setting loggedInUser:", newUser);
        onRegister(newUser);
        navigate("/ProductPage");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // registation request end here // registation request end here //

  // toggle password visibility

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }
  function toggleConfirm() {
    setShowConfirm((prev) => !prev);
  }

  // handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // remove uploaded photo
  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(defaultphoto);
  };

  return (
    <>
      <div className="registration-container">
        <div className="photo-container">
          <img src={photo} alt="photo" className="photo" />
        </div>
        <form className="form-container" onSubmit={handleSubmit}>
          <h1 className="registration-title">Registration</h1>

          <div className="form-inputs-container">
            <div className="input-container">
              <div className="photo-upload-container">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  className="file-input"
                />
                {photoPreview && (
                  <div className="photo-preview">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="preview-img"
                    />
                    <label htmlFor="file-upload" className="upload-label">
                      Upload Photo
                    </label>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <input
                type="text"
                name="username"
                placeholder="username *"
                onChange={handleChange}
                value={form.username}
                className="inputs"
              />
              {usernameError && (
                <div className="validation-errors">{usernameError}</div>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email *"
                onChange={handleChange}
                value={form.email}
                className="inputs"
              />
              {emailError && (
                <div className="validation-errors">{emailError}</div>
              )}
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password *"
                  onChange={handleChange}
                  value={form.password}
                  className="inputs"
                />
                <span onClick={togglePassword}>
                  {showPassword ? (
                    <img src={eyeview} alt="eye" className="eye" />
                  ) : (
                    <img src={eyehide} alt="eye" className="eye" />
                  )}
                </span>
                {passwordError && (
                  <div className="pass-validation-errors">{passwordError}</div>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="password_confirmation"
                  placeholder="Confirm Password *"
                  onChange={handleChange}
                  value={form.password_confirmation}
                  className="inputs"
                />
                <span onClick={toggleConfirm}>
                  {showConfirm ? (
                    <img src={eyeview} alt="eye" className="eye" />
                  ) : (
                    <img src={eyehide} alt="eye" className="eye" />
                  )}
                </span>
                {confirmError && (
                  <div className="pass-validation-errors">{confirmError}</div>
                )}
              </div>
            </div>

            <button type="submit" className="registration-btn">
              Sign up
            </button>

            <p className="register-link-container">
              Already member?{" "}
              <Link to="/" className="register-link-content">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Registration;
