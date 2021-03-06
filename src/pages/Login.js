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
      spacing={2}
      container
      direction="column"
      alignItems="center"
      justify="center"
      style={{ height: "100%" }}
    >
      <Grid item>
        <Box
          component="img"
          alt="jack-habbit-logo"
          src={icon}
          style={{
            height: 200,
            display: "block",
            margin: "0 auto",
          }}
        />
        <Container className={props.classes}>
          <Typography variant="h4">
            Welcome to the Daily Journaling App
          </Typography>
          <hr />
          <Typography variant="h5">
            Choose your preferred sign-in method to continue
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
