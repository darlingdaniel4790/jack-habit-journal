import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import "firebase/storage";
import React, { useEffect, useState } from "react";
import { firestoreDB } from "..";

const steps = [];
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > *": {
      marginBottom: theme.spacing(1),
    },
  },
  header: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
  img: {
    height: 255,
  },
  mobileStepper: {
    display: "fixed",
    bottom: 0,
    alignItems: "flex-end",
    marginBottom: 0,
  },
  optionsSection: {
    padding: theme.spacing(2),
  },
  scrollBox: {
    display: "flex",
    overflowX: "scroll",
  },
  stepButtons: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const DailyStepper = (props) => {
  const [responses, setResponses] = useState();
  const [loading, setLoading] = useState(true);
  // fetch from firestore
  useEffect(() => {
    firestoreDB
      .collection("survey-questions")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          steps.push(doc.data());
          console.log(doc.id, " => ", doc.data());
        });
        setLoading(false);
      });
    return () => {};
  }, []);

  // firebase
  //   .storage()
  //   .refFromURL(
  //     "gs://jack-habit-journal.appspot.com/questions-images/happy/happy1.png"
  //   )
  //   .getDownloadURL()
  //   .then((url) => setImageUrl(url));

  // write to firestore

  const matches = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const classes = useStyles();
  // const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  // const maxSteps = steps.length;
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  let questionShown = "";
  if (!loading)
    switch (steps[activeStep].type) {
      // scale 1-5 multi questions
      case 1:
        questionShown = (
          <>
            <Paper className={classes.header}>
              <Typography variant="h6">
                Please Indicate the extent to which you agree wth the following
                statements.
              </Typography>
            </Paper>
            {steps[activeStep].questions.map((data) => {
              return (
                <>
                  <Paper className={classes.optionsSection}>
                    <Typography>{data}</Typography>
                  </Paper>
                </>
              );
            })}
          </>
        );
        break;

      // scale 1-9 images
      case 2:
        questionShown = (
          <>
            <Paper className={classes.header}>
              <Typography variant="h6">{steps[activeStep].question}</Typography>
            </Paper>
            <Paper className={classes.optionsSection}>
              <Box
                className={classes.scrollBox}
                style={{ maxWidth: `${matches ? "90vw" : "78vw"}` }}
              >
                {steps[activeStep].photosURL.forEach((url) => {
                  firebase
                    .storage()
                    .refFromURL(url)
                    .getDownloadURL()
                    .then((url) => {
                      console.log("fetched");
                      return (
                        <>
                          <img
                            className={classes.img}
                            src={url}
                            alt={steps[activeStep].type}
                          />
                        </>
                      );
                    });
                })}
              </Box>
              <Grid container>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    // value=""
                    // onChange=""
                  >
                    <FormControlLabel
                      value="stronglyDisagree"
                      control={<Radio />}
                      label="Strongly Disagree"
                    />
                    <FormControlLabel
                      value="disagree"
                      control={<Radio />}
                      label="disagree"
                    />
                    <FormControlLabel
                      value="notSure"
                      control={<Radio />}
                      label="Not Sure"
                    />
                    <FormControlLabel
                      value="agree"
                      control={<Radio />}
                      label="agree"
                    />
                    <FormControlLabel
                      value="stronglyAgree"
                      control={<Radio />}
                      label="Strongly Agree"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Paper>
          </>
        );
        break;

      // open writing question
      case 3:
        break;

      default:
        break;
    }

  return (
    <Grid item md={9} className={classes.root}>
      {loading ? (
        <Grid
          style={{ height: "100%" }}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      ) : (
        <>
          {questionShown}
          {/*           
          <Paper className={classes.optionsSection}>
            <Typography>The options for the answers will be here.</Typography>
            <Box
              className={classes.scrollBox}
              style={{ maxWidth: `${matches ? "90vw" : "78vw"}` }}
            >
              {!imageUrl ? (
                <CircularProgress />
              ) : (
                <img
                  className={classes.img}
                  src={imageUrl}
                  alt={steps[activeStep].type}
                />
              )}
            </Box>
          </Paper> */}
          <Grid container>
            <Button
              variant="contained"
              onClick={handleBack}
              disabled={activeStep < 1}
              className={classes.stepButtons}
            >
              back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.stepButtons}
            >
              next
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default DailyStepper;
