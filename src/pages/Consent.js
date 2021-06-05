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
import consentContent from "./consentContent.js";

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
    setCookie("signed", true);
    console.log("confirmed");
  };

  return (
    <Grid container justify="center" md={9} className={classes.root}>
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
