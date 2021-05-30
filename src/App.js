import React from "react";
import Login from "./components/Login";
import firebase from "firebase/app";
import { Alert, Container, Image } from "react-bootstrap";
import classes from "./App.module.css";
import icon from "./assets/emotion_images/logo192.png";

function App() {
  // check firebase sdk
  // let message = "";
  // try {
  //   let app = firebase.app();
  //   let features = [
  //     "auth",
  //     "database",
  //     "firestore",
  //     "functions",
  //     "messaging",
  //     "storage",
  //     "analytics",
  //     "remoteConfig",
  //     "performance",
  //   ].filter((feature) => typeof app[feature] === "function");
  //   message = (
  //     <Alert variant="info">{`Firebase SDK loaded with ${features.join(
  //       ", "
  //     )}`}</Alert>
  //   );
  // } catch (e) {
  //   console.error(e);
  //   message = (
  //     <Alert variant="warning">
  //       Error loading the Firebase SDK, check the console.
  //     </Alert>
  //   );
  // }

  return (
    <Container className={classes.app}>
      <Image src={icon} />
      <Container className={classes["login-container"]}>
        <p>Welcome to the Jack Habit Journal. Please login to continue.</p>
        <Login />
      </Container>
    </Container>
  );
}

export default App;
