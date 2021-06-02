import React, { useEffect, useState } from "react";
import classes from "./App.module.css";
import Login from "./pages/Login";
import Menu from "./components/Menu";
import { CircularProgress, Grid } from "@material-ui/core";
import firebase from "firebase/app";
import { ui, uiConfig } from "./";

function App() {
  const [showUI, setShowUI] = useState(false);
  console.log("showUI: " + showUI);
  const [loggedIn, setLoggedIn] = useState(false);
  console.log("loggedIn: " + loggedIn);
  const [loading, setLoading] = useState(true);

  ui.start("#firebaseui-auth-container", uiConfig);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log("auth state changing");
      if (user) {
        console.log(user);
        setShowUI(false);
        setLoggedIn(true);
      } else {
        setShowUI(true);
      }
      setLoading(false);
    });
  }, [loggedIn]);

  const handleLogout = () => {
    setLoggedIn(false);
    firebase.auth().signOut();
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.app}
    >
      {loading && <CircularProgress />}
      {!loading && loggedIn && <Menu handleLogout={handleLogout} />}
      <Login
        display={showUI ? "block" : "none"}
        classes={classes["login-container"]}
      />
    </Grid>
  );
}

export default App;
