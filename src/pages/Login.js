import React from "react";
import icon from "../assets/logo512.png";
import { Box, Container } from "@material-ui/core";

const Login = (props) => {
  return (
    <div style={{ display: `${props.display}` }}>
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
    </div>
  );
};

export default Login;
