import React, { useEffect } from "react";
import icon from "../assets/logo512.png";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { ui, uiConfig } from "..";

const Login = (props) => {
  useEffect(() => {
    ui.start("#firebaseui-auth-container", uiConfig);
    return () => {};
  }, []);
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justify="center"
      style={{ height: "100%", display: `${props.display}` }}
    >
      <Grid item>
        <Box
          component="img"
          alt="jack-habbit-logo"
          src={icon}
          style={{
            width: 200,
            height: 200,
            display: "block",
            margin: "0 auto",
          }}
        />
        <Container className={props.classes}>
          <Typography variant="h4">
            Welcome to the Jack Habit Journal.
          </Typography>
          <hr />
          <Typography variant="h5">
            Choose your preferred signin method to continue.
          </Typography>
        </Container>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div id="firebaseui-auth-container"></div>
      </Grid>
    </Grid>
  );
};

export default Login;
