import { useState } from "react";
import api from "../services/api";
import "../styles/login.scss";
import loginImage from "../assets/instaLogin.png"; 
import facebookIcon from "../assets/favicon.ico"; 

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

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
    try {
      await api.post("/auth/login", form);
      alert("Logged in successfully");
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="hero-image">
          <img src={loginImage} alt="Instagram Login" className="hero-img" />
        </div>

        <div className="form-section">
          <div className="form-card">
            <div className="instagram-logo">
              <div className="logo-gradient">Instagram</div>
            </div>

            <h2 className="form-title">Log into Instagram</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="text"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    placeholder="Mobile number, username or email"
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
                {loading ? <span className="loading-spinner"></span> : "Log in"}
              </button>

              <div className="forgot-password">
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>
            </form>

            <div className="divider">OR</div>

            <button className="facebook-login" type="button">
              <img src={facebookIcon} alt="Facebook" className="facebook-icon" />
              Log in with Facebook
            </button>
          </div>

          <div className="signup-card">
            Don't have an account?
            <a href="/register" className="signup-link">
              Create new account
            </a>
          </div>

          <div className="meta-footer">
            <div className="meta-logo">Meta</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
