import React from "react";
import icon from "../assets/logo512.png";
import firebase from "firebase/app";
import { ui, uiConfig } from "../";
import { useDispatch } from "react-redux";
import { userAuthActions } from "../store/userAuthSlice";
import { useSelector } from "react-redux";
import { Box, Container } from "@material-ui/core";

const Login = (props) => {
  const loggedIn = useSelector((state) => state.userAuth.isLoggedIn);
  const dispatch = useDispatch();
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

  return (
    <>
      <Box
        component="img"
        alt="jack-habbit-logo"
        src={icon}
        style={{ width: 200, height: 200, display: "block", margin: "0 auto" }}
      />
      <Container className={props.classes}>
        <h2>Welcome to the Jack Habit Journal.</h2>
        <p> Choose your preferred signin method to continue.</p>
        <div id="firebaseui-auth-container"></div>
      </Container>
    </>
  );
};

Login.propTypes = {};

export default Login;
