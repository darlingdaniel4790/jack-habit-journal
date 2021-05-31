import React from "react";
import { Button, Container, Image } from "react-bootstrap";
import classes from "./App.module.css";
import icon from "./assets/logo512.png";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { ui, uiConfig } from ".";
import { useDispatch } from "react-redux";
import { userAuthActions } from "./store/userAuthSlice";

function App() {
  const loggedIn = useSelector((state) => state.userAuth.isLoggedIn);
  const dispatch = useDispatch();
  console.log(loggedIn);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(userAuthActions.login());
      console.log(user);
    } else {
      if (!loggedIn) {
        ui.start("#firebaseui-auth-container", uiConfig);
      }
    }
  });

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

  const output = loggedIn ? (
    <>
      <h3>Welcome.</h3>
      <Button
        variant="outline-primary"
        onClick={() => dispatch(userAuthActions.logout())}
      >
        Logout
      </Button>
    </>
  ) : (
    <>
      <Image src={icon} style={{ width: 200, height: 200 }} />
      <Container className={classes["login-container"]}>
        <h2>Welcome to the Jack Habit Journal.</h2>
        <p> Choose your preferred signin method to continue.</p>
        <div id="firebaseui-auth-container"></div>
      </Container>
    </>
  );

  return <Container className={classes.app}>{output}</Container>;
}

export default App;
