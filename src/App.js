import React, { useEffect, useState } from "react";
import classes from "./App.module.css";
import Login from "./pages/Login";
import Menu from "./components/Menu";
import { CircularProgress, Grid } from "@material-ui/core";
import firebase from "firebase/app";
import { ui, uiConfig } from "./";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { purple } from "@material-ui/core/colors";
import { useCookies } from "react-cookie";

function App() {
  const [showUI, setShowUI] = useState(false);
  // console.log("showUI: " + showUI);
  const [loggedIn, setLoggedIn] = useState(false);
  // console.log("loggedIn: " + loggedIn);
  const [loading, setLoading] = useState(true);
  if (!loggedIn) ui.start("#firebaseui-auth-container", uiConfig);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (loggedIn) return;
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

  const [cookies] = useCookies(["theme"]);
  let theme = "";
  if (cookies.theme === "dark") {
    theme = createMuiTheme({
      palette: {
        type: "dark",
        primary: {
          main: purple[500],
        },
        secondary: {
          main: "#11cb5f",
        },
      },
    });
  } else {
    theme = createMuiTheme({
      palette: {
        primary: {
          main: purple[500],
        },
        secondary: {
          main: "#11cb5f",
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
        {!loading && loggedIn && <Menu handleLogout={handleLogout} />}
        {!loggedIn && (
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
