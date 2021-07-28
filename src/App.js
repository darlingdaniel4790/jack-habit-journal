import React, { useEffect, useState } from "react";
import classes from "./App.module.css";
import Login from "./pages/Login";
import Menu from "./components/Menu";
import { CircularProgress, Grid } from "@material-ui/core";
// import Button from "@material-ui/core/Button";
import firebase from "firebase/app";
import "firebase/messaging";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { useCookies } from "react-cookie";
import { firestoreDB } from ".";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import Admin from "./pages/Admin";
import CssBaseline from "@material-ui/core/CssBaseline";
// import Consent from "./pages/Consent";

function App(props) {
  // const snackbar = (
  //   <Snackbar
  //     open={props.showReload}
  //     message="A new version is available!"
  //     onClick={props.reloadPage}
  //     anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  //     action={
  //       <Button
  //         variant="contained"
  //         // color="inherit"
  //         size="small"
  //         onClick={props.reloadPage}
  //       >
  //         Reload
  //       </Button>
  //     }
  //   />
  // );

  // console.log("\nAPP.JS RENDERING");
  const [showUI, setShowUI] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [cookies] = useCookies(["theme", "signed"]);
  // const [consentSigned, setConsentSigned] = useState(cookies.signed);

  function iOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  }

  // register user notification token
  useEffect(() => {
    if (!iOS()) {
      const messaging = firebase.messaging();
      messaging
        .getToken({
          vapidKey:
            "BHed2bPnik__C-NU7efDYnHl3XsBvcTXkpgpdI0-HxM7RF8s9BRM8fJypYjQz4h10NzCl9MQVWX-OOyhX2z1KUc",
        })
        .then((token) => {
          if (token) {
            // firestoreDB
            //   .collection("participants")
            //   .doc(userInfo.uid)
            //   .set(
            //     {
            //       notificationToken: token,
            //     },
            //     { merge: true }
            //   )
            //   .then(() => {
            //     console.log("token added");
            //   })
            //   .catch((error) => {
            //     console.error("error adding notification token: ", error);
            //   });
            // console.log(token);
          } else {
            // ask for permission again if blocked
          }
        })
        .catch((e) => console.log(e));
    }
    // if (loggedIn) {
    // }
  }, [loggedIn, userInfo]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (loggedIn) return;
      // console.log("auth state changing");
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
                // console.log("user exists");
                admin = snapshot.data().admin;
              } else {
                // console.log("user doesn't exist");
                // add user to db
                firestoreDB
                  .collection("participants")
                  .doc(user.uid)
                  .set(
                    {
                      id: user.uid,
                      name: user.displayName,
                      email: user.email,
                      regDate: firebase.firestore.Timestamp.now(),
                    },
                    { merge: true }
                  )
                  .then(() => {
                    console.log("user added to database");
                  })
                  .catch((error) => {
                    console.error("error adding user: ", error);
                  });
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
      <CssBaseline />
      <Grid container direction="column" className={classes.app}>
        {/* {snackbar} */}
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
          //consentSigned &&
          <Menu
            handleLogout={handleLogout}
            userInfo={userInfo}
            // consentSigned={consentSigned}
            // setConsentSigned={setConsentSigned}
          />
        )}
        {/* {!loading && !userInfo.admin && !consentSigned && (
          <Grid container justify="center">
            <Consent userInfo={userInfo} setConsentSigned={setConsentSigned} />
          </Grid>
        )} */}
        {!loading && loggedIn && userInfo.admin && (
          <Admin handleLogout={handleLogout} />
        )}
        {!loggedIn &&
          //consentSigned &&
          showUI && <Login classes={classes["login-container"]} />}
      </Grid>
    </ThemeProvider>
  );
}

export default App;
