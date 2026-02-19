import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; 
import "../styles/login.scss";
import loginImage from "../../../assets/instaLogin.png";
import facebookIcon from "../../../assets/favicon.ico";

function Login() {
  const [form, setForm] = useState({
    identifier: "", 
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    
    if (!form.identifier || form.identifier.trim().length === 0) {
      newErrors.identifier = "Username or email is required";
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
     
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        form,
        { withCredentials: true } 
      );
      alert(response.data.message || "Logged in successfully!");
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
                    className={`form-input ${errors.identifier ? "error" : ""}`}
                    placeholder="Mobile number, username or email"
                    value={form.identifier}
                    onChange={(e) => {
                      setForm({ ...form, identifier: e.target.value });
                      if (errors.identifier) setErrors({ ...errors, identifier: null });
                    }}
                  />
                </div>
                {errors.identifier && (
                  <div className="error-message">{errors.identifier}</div>
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
            <Link to="/register" className="signup-link">
              Create new account
            </Link>
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