import React, { useState } from "react";
import "./LoginSignup.css";

const AuthPage = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const togglePanel = () => {
    setIsRightPanelActive((active) => !active);
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Account created successfully!");
        setSignupData({ name: "", email: "", password: "" });
        setIsRightPanelActive(false);
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to the EcoBloom backend. Make sure the Python server is running.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectUrl;
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the EcoBloom backend. Make sure the Python server is running.");
    }
  };

  return (
    <div className="auth-body">
      <div
        className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}
        id="container"
      >
        {/* Sign Up Container */}
        <div className="auth-form-container sign-up-container">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>

            <div className="infield">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={signupData.name}
                onChange={(e) => handleChange(e, "signup")}
                required
              />
            </div>

            <div className="infield">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => handleChange(e, "signup")}
                required
              />
            </div>

            <div className="infield">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) => handleChange(e, "signup")}
                required
              />
            </div>

            <button className="ghostBtn" type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Container */}
        <div className="auth-form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <span>or use your account</span>

            <div className="infield">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => handleChange(e, "login")}
                required
              />
            </div>

            <div className="infield">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => handleChange(e, "login")}
                required
              />
            </div>

            <a href="#" className="forgot">Forgot your password?</a>
            <button className="ghostBtn" type="submit">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="animated-bg"></div>

            <div className="floating-elements">
              <div>🍃</div>
              <div>🍃</div>
              <div>🍃</div>
              <div>🍃</div>
              <div>🍃</div>
            </div>

            <div className="overlay-panel overlay-left">
              <h1>Reduce</h1>
              <p>Join us in making the world greener. Login to track</p>
              <button className="ghost" onClick={togglePanel}>Sign In</button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1>Start</h1>
              <p>Sign up and calculate your carbon impact to help make a difference.</p>
              <button className="ghost" onClick={togglePanel}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
