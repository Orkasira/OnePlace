import "./Registration.css";
import photo from "../../assets/62bc5492a876268b6b9fc395f006a9259cafde47.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import eyeview from "../../assets/eyeview.png";
import eyehide from "../../assets/eyehide.png";
import defaultphoto from "../../assets/defaultphoto.jpg";
import { useFormik } from "formik";
import * as Yup from "yup";

function Registration({ onRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(defaultphoto);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // registration validation

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("This field is required."),

      email: Yup.string()
        .email("Please enter valid email")
        .required("This field is required."),

      password: Yup.string()
        .min(3, "Password must be at least 3 characters")
        .required("This field is required."),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("This field is required."),
    }),

    onSubmit: async (values, { resetForm }) => {
      setUsernameError("");
      setEmailError("");
      setPasswordError("");

      try {
        const formData = new FormData();

        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("password_confirmation", values.confirmPassword);

        if (photoFile) {
          formData.append("avatar", photoFile);
        }

        const res = await fetch(
          "https://oneplace-production-0q4o50.laravel.cloud/api/register",
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

        if (!res.ok) {
          setUsernameError(data.errors?.username?.[0] || "");
          setEmailError(data.errors?.email?.[0] || "");
          setPasswordError(data.errors?.password?.[0] || "");
          return;
        }

        const newUser = {
          username: values.username,
          email: values.email,
          profile_photo: photoPreview,
        };

        onRegister?.(newUser);
        resetForm();
        setPhotoFile(null);
        setPhotoPreview(defaultphoto);
        navigate("/ProductPage");
      } catch (err) {
        console.error("Server Error:", err);
        setPasswordError("Registration failed. Please try again.");
      }
    },
  });

  const navigate = useNavigate();

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

  return (
    <div className="registration-container">
      <div className="photo-container">
        <img src={photo} alt="photo" className="photo" />
      </div>

      <form className="form-container" onSubmit={formik.handleSubmit}>
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
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="inputs"
            />

            <div className="validation-errors">
              {(formik.touched.username && formik.errors.username) ||
                usernameError}
            </div>

            {/* email */}

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="inputs"
            />

            <div className="validation-errors">
              {(formik.touched.email && formik.errors.email) || emailError}
            </div>

            {/* password */}

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password *"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="inputs"
              />

              <span onClick={togglePassword}>
                <img
                  src={showPassword ? eyeview : eyehide}
                  alt="eye"
                  className="eye"
                />
              </span>

              <div className="pass-validation-errors">
                {(formik.touched.password && formik.errors.password) ||
                  passwordError}
              </div>
            </div>

            {/* confirm password */}

            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="inputs"
              />

              <span onClick={toggleConfirm}>
                <img
                  src={showConfirm ? eyeview : eyehide}
                  alt="eye"
                  className="eye"
                />
              </span>

              <div className="pass-validation-errors">
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword}
              </div>
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
