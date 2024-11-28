import React, { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./style.css";

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <button className="auth-button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
      </div>
      <h2 className="login-title">{isLogin ? "Login" : "Sign Up"}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="auth-button">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Auth;
