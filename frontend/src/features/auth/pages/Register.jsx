import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/register.scss";
import registerImage from "../../../assets/instaRegister.png";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.username || form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="hero-image">
          <img
            src={registerImage}
            alt="Instagram Register"
            className="hero-img"
          />
        </div>

        <div className="form-section">
          <div className="form-card">
            <div className="instagram-logo">
              <div className="logo-gradient">Instagram</div>
            </div>

            <h2 className="signup-heading">
              Sign up to see photos and videos from your friends.
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`form-input ${errors.username ? "error" : ""}`}
                    placeholder="Username"
                    value={form.username}
                    onChange={(e) => {
                      setForm({ ...form, username: e.target.value });
                      if (errors.username)
                        setErrors({ ...errors, username: null });
                    }}
                  />
                </div>
                {errors.username && (
                  <div className="error-message">{errors.username}</div>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                  />
                </div>
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${errors.password ? "error" : ""}`}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                      if (errors.password)
                        setErrors({ ...errors, password: null });
                    }}
                  />
                  {form.password && (
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  "Sign up"
                )}
              </button>

              <div className="terms-text">
                By signing up, you agree to our{" "}
                <a href="#" className="terms-link">
                  Terms
                </a>
                ,{" "}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="terms-link">
                  Cookies Policy
                </a>
                .
              </div>
            </form>
          </div>

          <div className="login-card">
            Have an account?
            <Link to="/login" className="login-link">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
