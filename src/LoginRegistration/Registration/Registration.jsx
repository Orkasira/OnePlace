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

    // clear errors while typing

    if (name === "username") setUsernameError("");
    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
    if (name === "password_confirmation") setConfirmError("");
  };

  // handle file change

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // remove photo

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(defaultphoto);
  };

  // toggle password

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirm = () => {
    setShowConfirm((prev) => !prev);
  };

  // submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");

    let valid = true;

    // username validation

    if (form.username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      valid = false;
    }

    // email validation

    if (!form.email.includes("@")) {
      setEmailError("Please enter valid email");
      valid = false;
    }

    // password validation

    if (form.password.length < 3) {
      setPasswordError("Password must be at least 3 characters");
      valid = false;
    }

    // confirm password

    if (form.password !== form.password_confirmation) {
      setConfirmError("Passwords do not match");
      valid = false;
    }

    if (!valid) return;

    try {
      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);

      // IMPORTANT

      if (photoFile) {
        formData.append("avatar", photoFile);
      }

      const res = await fetch(
        "https://api.redseam.redberryinternship.ge/api/register",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        },
      );

      const data = await res.json();

      console.log(data);

      // API validation errors

      if (!res.ok) {
        if (data.errors?.username) {
          setUsernameError(data.errors.username[0]);
        }

        if (data.errors?.email) {
          setEmailError(data.errors.email[0]);
        }

        if (data.errors?.password) {
          setPasswordError(data.errors.password[0]);
        }

        return;
      }

      // success

      const newUser = {
        username: form.username,
        email: form.email,
        profile_photo: photoPreview,
      };

      onRegister(newUser);

      navigate("/ProductPage");
    } catch (err) {
      console.error("Server Error:", err);
    }
  };

  return (
    <div className="registration-container">
      <div className="photo-container">
        <img src={photo} alt="photo" className="photo" />
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <h1 className="registration-title">Registration</h1>

        <div className="form-inputs-container">
          <div className="input-container">
            {/* photo upload */}

            <div className="photo-upload-container">
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div className="photo-preview">
                <img src={photoPreview} alt="Preview" className="preview-img" />

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
            </div>

            {/* username */}

            <input
              type="text"
              name="username"
              placeholder="Username *"
              value={form.username}
              onChange={handleChange}
              className="inputs"
            />

            {usernameError && (
              <div className="validation-errors">{usernameError}</div>
            )}

            {/* email */}

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              className="inputs"
            />

            {emailError && (
              <div className="validation-errors">{emailError}</div>
            )}

            {/* password */}

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password *"
                value={form.password}
                onChange={handleChange}
                className="inputs"
              />

              <span onClick={togglePassword}>
                <img
                  src={showPassword ? eyeview : eyehide}
                  alt="eye"
                  className="eye"
                />
              </span>

              {passwordError && (
                <div className="pass-validation-errors">{passwordError}</div>
              )}
            </div>

            {/* confirm password */}

            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                placeholder="Confirm Password *"
                value={form.password_confirmation}
                onChange={handleChange}
                className="inputs"
              />

              <span onClick={toggleConfirm}>
                <img
                  src={showConfirm ? eyeview : eyehide}
                  alt="eye"
                  className="eye"
                />
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
  );
}

export default Registration;
