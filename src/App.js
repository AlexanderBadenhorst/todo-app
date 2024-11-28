import React from "react";
import Auth from "./Auth";
import Todo from "./Todo";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";

const App = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true); // State to manage loading

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user state based on auth state
      setLoading(false); // Set loading to false after checking auth state
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking auth state
  }

  return (
    <div className="app-container">
      <div className="logout-button-container">
        {user && (
          <button className="logout-button" onClick={() => auth.signOut()}>
            Logout
          </button>
        )}{" "}
        {/* Logout button */}
      </div>
      <h1 className="app-title">Todo App</h1>{" "}
      {/* Title with class for styling */}
      {user ? (
        <>
          <p className="welcome-message">Welcome, {user.email}</p>{" "}
          {/* Welcome message with class for styling */}
          <Todo />
        </>
      ) : (
        <Auth setUser={setUser} /> /* Pass setUser to Auth component */
      )}
    </div>
  );
};

export default App;
