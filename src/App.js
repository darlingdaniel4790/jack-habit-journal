import React, { useEffect, useState } from "react";
import classes from "./App.module.css";
import Login from "./pages/Login";
import Menu from "./components/Menu";
import { CircularProgress, Grid } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/messaging";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { useCookies } from "react-cookie";
import { firestoreDB } from ".";

function App() {
  // console.log("\nAPP.JS RENDERING");
  const [showUI, setShowUI] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const [consentSigned, setConsentSigned] = useState(false);

  const messaging = firebase.messaging();

  // register user notification token
  useEffect(() => {
    if (loggedIn) {
      messaging
        .getToken({
          vapidKey:
            "BHed2bPnik__C-NU7efDYnHl3XsBvcTXkpgpdI0-HxM7RF8s9BRM8fJypYjQz4h10NzCl9MQVWX-OOyhX2z1KUc",
        })
        .then((token) => {
          if (token) {
            firestoreDB
              .collection("participants")
              .doc(userInfo.uid)
              .collection("devices")
              .add({
                token,
              })
              .then(() => {
                console.log("token added");
              })
              .catch((error) => {
                console.error("error adding notification token: ", error);
              });
          } else {
            // ask for permission again if blocked
          }
        })
        .catch((e) => console.log(e));
    }
  }, [messaging, loggedIn, userInfo]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      // console.log("auth state changing");
      if (loggedIn) return;
      if (user) {
        firestoreDB
          .collection("participants")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              // user has accepted terms and been added to database
              setConsentSigned(true);
            }
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setUserInfo(user);
            if (showUI) setShowUI(false);
            setLoggedIn(true);
          });
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
  const theme = createMuiTheme({
    palette: {
      type: cookies.theme ? cookies.theme : "light",
      primary: {
        main: "#80e2dd",
      },
      secondary: {
        main: "#fac82b",
      },
    },
  });

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
          <Menu
            handleLogout={handleLogout}
            userInfo={userInfo}
            consentSigned={consentSigned}
            setConsentSigned={setConsentSigned}
          />
        )}
        {!loggedIn && showUI && <Login classes={classes["login-container"]} />}
      </Grid>
    </ThemeProvider>
  );
}

export default App;
