import {
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { firestoreDB } from "../index.js";
import consentContent from "./consentContent.js";
import firebase from "firebase/app";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
  bottomGroup: {
    justifyContent: "center",
  },
}));

const Consent = (props) => {
  const [, setCookie] = useCookies(["signed"]);

  const classes = useStyles();
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(!checked);
  };

  const handleConfirm = (e) => {
    firestoreDB
      .collection("participants")
      .doc(props.userInfo.uid)
      .set({
        id: props.userInfo.uid,
        name: props.userInfo.displayName,
        email: props.userInfo.email,
        regDate: firebase.firestore.Timestamp.now(),
      })
      .then(() => {
        console.log("user added to database");
        setCookie("signed", true);
      })
      .catch((error) => {
        console.error("error adding user: ", error);
      });
  };

  return (
    <Grid container item justify="center" md={9} className={classes.root}>
      <Typography variant="h5">Consent Form</Typography>
      <TextField
        id="terms"
        label=""
        variant="filled"
        multiline
        fullWidth
        defaultValue={consentContent}
        InputProps={{
          readOnly: true,
        }}
      />
      <FormGroup row className={classes.bottomGroup}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              name="checkedB"
              color="primary"
            />
          }
          label="I agree"
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!checked}
          onClick={handleConfirm}
        >
          confirm
        </Button>
      </FormGroup>
    </Grid>
  );
};

export default Consent;
