import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";

// firebase imports
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";
import "firebase/auth";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxcmAeKdG1WRjfbMElmgfBAWGAKRL2dKI",
  authDomain: "jack-habit-journal.firebaseapp.com",
  projectId: "jack-habit-journal",
  storageBucket: "jack-habit-journal.appspot.com",
  messagingSenderId: "222937404677",
  appId: "1:222937404677:web:b7cd36ed880ca8873a136c",
  measurementId: "G-HW3NXYKPSH",
};
// firebase initialization
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
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