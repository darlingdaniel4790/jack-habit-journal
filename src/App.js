import React, { useEffect, useState } from "react";
import classes from "./App.module.css";
import Login from "./pages/Login";
import Menu from "./components/Menu";
import { CircularProgress, Grid } from "@material-ui/core";
import firebase from "firebase/app";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { useCookies } from "react-cookie";

function App() {
  // console.log("\nAPP.JS RENDERING");
  const [showUI, setShowUI] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      // console.log("auth state changing");
      if (loggedIn) return;
      if (user) {
        setUserInfo(user);
        if (showUI) setShowUI(false);
        setLoggedIn(true);
      } else {
        if (!showUI) setShowUI(true);
      }
      if (loading) setLoading(false);
    });
  });

  const handleLogout = () => {
    setLoggedIn(false);
    firebase.auth().signOut();
  };

  const [cookies] = useCookies(["theme"]);
  let theme = "";
  if (cookies.theme === "dark") {
    theme = createMuiTheme({
      palette: {
        type: "dark",
        primary: {
          main: "#80e2dd",
        },
        secondary: {
          main: "#fac82b",
        },
      },
    });
  } else {
    theme = createMuiTheme({
      palette: {
        primary: {
          main: "#80e2dd",
        },
        secondary: {
          main: "#fac82b",
        },
      },
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="column" className={classes.app}>
        {loading && (
          <Grid
            style={{ height: "100%" }}
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <CircularProgress />
          </Grid>
        )}
        {!loading && loggedIn && (
          <Menu handleLogout={handleLogout} userInfo={userInfo} />
        )}
        {!loggedIn && showUI && (
          <Login
            display={showUI ? "flex" : "none"}
            classes={classes["login-container"]}
          />
        )}
      </Grid>
    </ThemeProvider>
  );
}

export default App;
