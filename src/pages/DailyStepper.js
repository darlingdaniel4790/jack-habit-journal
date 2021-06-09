import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import firebase from "firebase/app";
import "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { firestoreDB } from "..";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > *": {
      marginBottom: theme.spacing(1),
    },
    margin: "0 auto",
  },
  header: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
    color: "black",
  },
  img: {
    height: 255,
    margin: "5rem",
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
    bottom: 0,
    margin: theme.spacing(1),
  },
  stepButtonsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    zIndex: 1,
    marginBottom: 0,
    justifyContent: "space-between",
  },
  radioFormControl: {
    width: "100%",
  },
  radioGroup: {
    width: "100%",
    justifyContent: "space-between",
  },
  subHeading: {
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(2),
  },
}));

const questions = [];

const DailyStepper = (props) => {
  const [responses, setResponses] = useState([]);
  console.log(responses);
  const [loading, setLoading] = useState(true);
  // fetch from firestore
  useEffect(() => {
    firestoreDB
      .collection("survey-questions")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          questions.push(doc.data());
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
  const [activeStep, setActiveStep] = useState(0);
  const questionsLength = questions.length;
  const [questionImages, setquestionImages] = useState();

  const ref = useRef();
  const handleNext = () => {
    if (activeStep < questionsLength - 1) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "end",
      });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setquestionImages();
    }
  };

  const handleBack = () => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "end",
    });
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  let questionShown = "";
  if (!loading)
    switch (questions[activeStep].type) {
      // scale 1-5 multi questions
      case 1:
        questionShown = (
          <QuestionType1
            {...questions[activeStep]}
            classes={classes}
            matches={matches}
            responses={responses}
            setResponses={setResponses}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
        break;

      // scale 1-9 images
      case 2:
        questionShown = (
          <QuestionType2
            questions={questions}
            classes={classes}
            matches={matches}
            questionImages={questionImages}
            setquestionImages={setquestionImages}
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
          />
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
      <div ref={ref} style={{ margin: 0 }}></div>
      {loading ? (
        <Grid
          style={{ height: "85vh" }}
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
          {/* <Grid
            ref={ref}
            container
            direction="column"
            style={{
              height: "85vh",
              backgroundColor: theme.palette.secondary.main,
              overflowX: "hidden",
            }}
          >
            <Grid
              container
              style={{
                height: "100%",
                borderColor: theme.palette.secondary.main,
                width: "95vw",
                margin: "20px",
              }}
            ></Grid>
            <Grid
              container
              style={{
                height: "100%",
                borderColor: theme.palette.primary.main,
                width: "95vw",
                margin: "20px",
              }}
            ></Grid>
          </Grid> */}
        </>
      )}
    </Grid>
  );
};

const QuestionType1 = (props) => {
  let initialState = [];
  if (props.responses[props.activeStep]) {
    initialState = props.responses[props.activeStep];
  } else {
    initialState = props.questions.map((item, index) => {
      return {
        name: index.toString(),
        value: "",
      };
    });
  }
  const [responses, setResponses] = useState(initialState);

  const handleChange = (e) => {
    setResponses((prev) => {
      const newValue = prev;
      newValue[e.target.name].value = e.target.value;
      return [...newValue];
    });
  };

  const handleNext = () => {
    props.setResponses((prev) => {
      const newState = prev;
      newState[props.activeStep] = responses;
      return newState;
    });
    props.handleNext();
  };

  const handleBack = () => {
    props.setResponses((prev) => {
      const newState = prev;
      newState[props.activeStep] = responses;
      return newState;
    });
    props.handleBack();
  };

  return (
    <>
      <Grid container className={props.classes.stepButtonsContainer}>
        <Button
          variant="contained"
          onClick={handleBack}
          disabled={props.activeStep < 1}
          className={props.classes.stepButtons}
        >
          back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={props.classes.stepButtons}
        >
          {/* {activeStep < questionsLength - 1 ? "next" : "finish"} */}
          next
        </Button>
      </Grid>
      <Paper className={props.classes.header}>
        <Typography variant="h6">
          Please Indicate the extent to which you agree wth the following
          statements.
        </Typography>
      </Paper>
      {props.questions.map((data, index) => {
        return (
          <Paper key={index} className={props.classes.optionsSection}>
            <Typography variant="h6" className={props.classes.subHeading}>
              {data}
            </Typography>
            <FormControl
              component="fieldset"
              className={props.classes.radioFormControl}
            >
              <RadioGroup
                className={props.classes.radioGroup}
                row={props.matches ? true : false}
                aria-label="scale"
                name={"" + index}
                value={responses[index].value}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="stronglyDisagree"
                  control={<Radio />}
                  label="Strongly Disagree"
                />
                <FormControlLabel
                  value="disagree"
                  control={<Radio />}
                  label="Disagree"
                />
                <FormControlLabel
                  value="notSure"
                  control={<Radio />}
                  label="Not Sure"
                />
                <FormControlLabel
                  value="agree"
                  control={<Radio />}
                  label="Agree"
                />
                <FormControlLabel
                  value="stronglyAgree"
                  control={<Radio />}
                  label="Strongly Agree"
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        );
      })}
    </>
  );
};

const QuestionType2 = (props) => {
  const images = [];
  let output = "";
  if (!props.questionImages) {
    props.questions[props.activeStep].photosURL.forEach((link) => {
      firebase
        .storage()
        .refFromURL(link)
        .getDownloadURL()
        .then((url) => {
          images.push(url);
          if (
            images.length ===
              props.questions[props.activeStep].photosURL.length &&
            !props.questionImages
          ) {
            props.setquestionImages(images);
            console.log("images set");
          }
        });
    });
  } else {
    output = props.questionImages.map((url, index) => {
      return (
        <img
          key={index}
          className={props.classes.img}
          src={url}
          alt={props.questions[props.activeStep].type}
        />
      );
    });
    console.log(output);
  }

  return (
    <>
      <Grid container className={props.classes.stepButtonsContainer}>
        <Button
          variant="contained"
          onClick={props.handleBack}
          disabled={props.activeStep < 1}
          className={props.classes.stepButtons}
        >
          back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={props.handleNext}
          className={props.classes.stepButtons}
        >
          {/* {activeStep < questionsLength - 1 ? "next" : "finish"} */}
          next
        </Button>
      </Grid>
      <Paper className={props.classes.header}>
        <Typography variant="h6">
          {props.questions[props.activeStep].question}
        </Typography>
      </Paper>
      <Paper className={props.classes.optionsSection}>
        <Box
          className={props.classes.scrollBox}
          style={{ maxWidth: `${props.matches ? "90vw" : "78vw"}` }}
        >
          {output}
        </Box>
        <FormControl component="fieldset">
          <RadioGroup
            row={props.matches ? true : false}
            aria-label="scale"
            name="scale of 9"
            // value=""
            // onChange=""
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="1"
              labelPlacement="start"
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="2"
              labelPlacement="start"
            />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="3"
              labelPlacement="start"
            />
            <FormControlLabel
              value="4"
              control={<Radio />}
              label="4"
              labelPlacement="start"
            />
            <FormControlLabel
              value="5"
              control={<Radio />}
              label="5"
              labelPlacement="start"
            />
            <FormControlLabel
              value="6"
              control={<Radio />}
              label="6"
              labelPlacement="start"
            />
            <FormControlLabel
              value="7"
              control={<Radio />}
              label="7"
              labelPlacement="start"
            />
            <FormControlLabel
              value="8"
              control={<Radio />}
              label="8"
              labelPlacement="start"
            />
            <FormControlLabel
              value="9"
              control={<Radio />}
              label="9"
              labelPlacement="start"
            />
          </RadioGroup>
        </FormControl>
      </Paper>
    </>
  );
};
// const QuestionType3 = (props) => {
//   return <p></p>;
// };

export default DailyStepper;
