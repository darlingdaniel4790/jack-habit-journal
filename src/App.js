import React from "react";
import classes from "./App.module.css";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Menu from "./components/Menu";
import { Container } from "@material-ui/core";

function App() {
  const loggedIn = useSelector((state) => state.userAuth.isLoggedIn);

  const output = loggedIn ? (
    <>
      <Menu />
    </>
  ) : (
    <Login classes={classes["login-container"]} />
  );

  return <Container className={classes.app}>{output}</Container>;
}

export default App;
