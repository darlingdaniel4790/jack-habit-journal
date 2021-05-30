import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import classes from "./Login.module.css";
// import PropTypes from 'prop-types'
import { userAuthActions } from "../store/userAuthSlice";
import { useDispatch } from "react-redux";

const Login = (props) => {
  const dispatch = useDispatch();
  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(userAuthActions.login());
    dispatch(userAuthActions.setDisplayName("Darlington Daniel"));
  };
  return (
    <Container className={classes["form-body"]}>
      <Form onSubmit={onSubmitHandler}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
          <Button variant="primary" type="submit">
            Signup
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

Login.propTypes = {};

export default Login;
