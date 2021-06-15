import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { CookiesProvider } from "react-cookie";

// firebase imports
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";
import "firebase/auth";
import "firebase/firestore";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfLKLLe2dNaPVKKbXFBcxijG5ZyFywiW0",
  authDomain: "jackhabbitjournal.firebaseapp.com",
  projectId: "jackhabbitjournal",
  storageBucket: "jackhabbitjournal.appspot.com",
  messagingSenderId: "240014016778",
  appId: "1:240014016778:web:7a04641b8c26f4ccd0baf3",
};

// firebase initialization
firebase.initializeApp(firebaseConfig);

export const firestoreDB = firebase.firestore();
export const realtimeDB = firebase.database();

// if (window.location === "localhost") {
//   firestoreDB.useEmulator("localhost", 8080);
//   databaseDB.useEmulator("localhost", 9000);
// }

// firebaseui config
export const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function () {
      return false;
    },
  },
  signInFlow: "popup",
  signInSuccessUrl: "./",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
};

// Initialize the FirebaseUI Widget using Firebase.
export const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start("#firebaseui-auth-container", uiConfig);

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
