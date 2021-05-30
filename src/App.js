import React from "react";
import classes from "./App.module.css";
import Login from "./components/Login";
import firebase from "firebase/app";

function App() {
  let message = "";
  try {
    let app = firebase.app();
    let features = [
      "auth",
      "database",
      "firestore",
      "functions",
      "messaging",
      "storage",
      "analytics",
      "remoteConfig",
      "performance",
    ].filter((feature) => typeof app[feature] === "function");
    message = `Firebase SDK loaded with ${features.join(", ")}`;
  } catch (e) {
    console.error(e);
    message = "Error loading the Firebase SDK, check the console.";
  }

  return (
    <div className={classes.App}>
      <header className={classes["App-header"]}>
        <p>Welcome to the Jack Habit Journal.</p>
        <p>Please login to continue.</p>
        <Login />
        {message}
      </header>
    </div>
  );
}

export default App;
