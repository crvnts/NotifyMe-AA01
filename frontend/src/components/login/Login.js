import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (response.ok) {
        const data = await response.json();
        setLoginStatus("Success");
        console.log("login success", data);
      } else {
        // Handle server-side validation errors or other issues
        setLoginStatus("Login failed. Please check your credentials.");
      }
    } catch (error) {
      // Handle network errors
      console.error("Login error:", error);
      setLoginStatus("Login failed. Please try again later.");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
};

export default Login;