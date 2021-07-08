import React, { useEffect, useState } from "react";
import classes from "./App.module.css";
import Login from "./pages/Login";
import Menu from "./components/Menu";
import { CircularProgress, Grid, Snackbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import firebase from "firebase/app";
// import "firebase/messaging";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { useCookies } from "react-cookie";
import { firestoreDB } from ".";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import Admin from "./pages/Admin";

function App() {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  const onSWUpdate = (registration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShowReload(false);
    window.location.reload(true);
  };

  const snackbar = (
    <Snackbar
      open={showReload}
      message="A new version is available!"
      onClick={reloadPage}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      action={
        <Button
          variant="contained"
          color="inherit"
          size="small"
          onClick={reloadPage}
        >
          Reload
        </Button>
      }
    />
  );

  // console.log("\nAPP.JS RENDERING");
  const [showUI, setShowUI] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [consentSigned, setConsentSigned] = useState(false);
  const [cookies, setCookies] = useCookies(["theme", "signed"]);
  // const messaging = firebase.messaging();

  // // register user notification token
  // useEffect(() => {
  //   if (loggedIn) {
  //     messaging
  //       .getToken({
  //         vapidKey:
  //           "BHed2bPnik__C-NU7efDYnHl3XsBvcTXkpgpdI0-HxM7RF8s9BRM8fJypYjQz4h10NzCl9MQVWX-OOyhX2z1KUc",
  //       })
  //       .then((token) => {
  //         if (token) {
  //           firestoreDB
  //             .collection("participants")
  //             .doc(userInfo.uid)
  //             .set(
  //               {
  //                 notificationToken: token,
  //               },
  //               { merge: true }
  //             )
  //             .then(() => {
  //               console.log("token added");
  //             })
  //             .catch((error) => {
  //               console.error("error adding notification token: ", error);
  //             });
  //         } else {
  //           // ask for permission again if blocked
  //         }
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // }, [messaging, loggedIn, userInfo]);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      // console.log("auth state changing");
      if (loggedIn) return;
      if (user) {
        let admin;
        // check if user exists and if admin
        if (userInfo.admin === undefined)
          firestoreDB
            .collection("participants")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                // user has accepted terms and been added to database
                setCookies("signed", true);
                setConsentSigned(true);
                admin = snapshot.data().admin;
              }
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              setUserInfo({ ...user, admin });
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
    setUserInfo({});
  };

  const theme = createMuiTheme({
    palette: {
      type: cookies.theme ? cookies.theme : "light",
      primary: {
        main: "#ffffff",
        dark: "#424242",
      },
      secondary: {
        main: cookies.theme === "dark" ? "#ffffff" : "#424242",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="column" className={classes.app}>
        {snackbar}
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
        {!loading && loggedIn && !userInfo.admin && (
          <Menu
            handleLogout={handleLogout}
            userInfo={userInfo}
            consentSigned={consentSigned}
            setConsentSigned={setConsentSigned}
          />
        )}
        {!loading && loggedIn && userInfo.admin && (
          <Admin handleLogout={handleLogout} />
        )}
        {!loggedIn && showUI && <Login classes={classes["login-container"]} />}
      </Grid>
    </ThemeProvider>
  );
}

export default App;
