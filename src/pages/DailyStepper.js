import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { firestoreDB } from "..";
import * as photos from "../assets/emotion_images";

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
    height: "170px",
    margin: "1rem",
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
  imageScrollBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  stepButtons: {
    bottom: 0,
    margin: theme.spacing(1),
  },
  stepButtonsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    zIndex: 999,
    marginBottom: 0,
    padding: "0 10px",
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

  const [activeStep, setActiveStep] = useState(5);
  console.log("Daily Stepper rendering");
  const ref = useRef();
  const handleNext = () => {
    if (activeStep < questions.length - 1) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "end",
      });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      // upload data and end the day
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
            activeStep={activeStep}
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
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            responses={responses}
            setResponses={setResponses}
          />
        );
        break;

      // open writing question
      case 3:
        questionShown = (
          <QuestionType3
            questions={questions}
            classes={classes}
            matches={matches}
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            responses={responses}
            setResponses={setResponses}
          />
        );
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
        <>{questionShown}</>
      )}
    </Grid>
  );
};

const QuestionType1 = (props) => {
  console.log("QuestionType1 rendering");

  let initialState = [];
  const [validated, setValidated] = useState(false);
  // const [checkedCount, setCheckedCount] = useState(0);
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

  if (!validated) {
    let control = false;
    responses.every((item) => {
      if (!item.value) {
        control = false;
        return false;
      }
      control = true;
      return true;
    });
    if (control) setValidated(control);
  }

  const handleChange = (e) => {
    // if (checkedCount < props.questions.length) {
    //   setCheckedCount((prev) => prev + 1);
    //   if (checkedCount === props.questions.length - 1) {
    //     setValidated(true);
    //   }
    // }
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
          // disabled={!validated && !props.responses[props.activeStep]}
          onClick={handleNext}
          className={props.classes.stepButtons}
        >
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
  // const images = [];
  // let output = "";
  // if (!props.questionImages) {
  //   props.questions[props.activeStep].photosURL.forEach((link) => {
  //     firebase
  //       .storage()
  //       .refFromURL(link)
  //       .getDownloadURL()
  //       .then((url) => {
  //         images.push(url);
  //         if (
  //           images.length ===
  //             props.questions[props.activeStep].photosURL.length &&
  //           !props.questionImages
  //         ) {
  //           props.setquestionImages(images);
  //           console.log("images set");
  //         }
  //       });
  //   });
  // } else {
  //   output = props.questionImages.map((url, index) => {
  //     return (
  //       <img
  //         key={index}
  //         className={props.classes.img}
  //         src={url}
  //         alt={props.questions[props.activeStep].type}
  //       />
  //     );
  //   });
  //   console.log(output);
  // }
  console.log("QuestionType2 rendering");

  let initialState = "x";
  const [validated, setValidated] = useState(false);
  const [response, setResponse] = useState(initialState);
  if (props.responses[props.activeStep]) {
    if (!response) {
      initialState = props.responses[props.activeStep];
    } else if (response === "x") {
      setResponse(props.responses[props.activeStep]);
    }
    if (!validated) setValidated(true);
  }

  const handleChange = (e) => {
    setValidated(true);
    setResponse(e.target.value);
  };
  const handleNext = () => {
    props.setResponses((prev) => {
      const newState = prev;
      newState[props.activeStep] = response;
      return newState;
    });
    setValidated(false);
    setResponse("x");
    props.handleNext();
  };

  const handleBack = () => {
    if (validated)
      props.setResponses((prev) => {
        const newState = prev;
        newState[props.activeStep] = response;
        return newState;
      });
    setResponse("x");
    props.handleBack();
  };

  let imageRef = [];
  switch (props.activeStep) {
    case 1:
      imageRef = [
        photos.happy1,
        photos.happy2,
        photos.happy3,
        photos.happy4,
        photos.happy5,
      ];
      break;
    case 2:
      imageRef = [
        photos.arousal1,
        photos.arousal2,
        photos.arousal3,
        photos.arousal4,
        photos.arousal5,
      ];
      break;
    case 3:
      imageRef = [
        photos.control1,
        photos.control2,
        photos.control3,
        photos.control4,
        photos.control5,
      ];
      break;

    default:
      break;
  }
  return (
    <>
      <Grid container className={props.classes.stepButtonsContainer}>
        <Button
          variant="contained"
          onClick={handleBack}
          className={props.classes.stepButtons}
        >
          back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={props.classes.stepButtons}
          disabled={!validated && !props.responses[props.activeStep]}
        >
          {/* {activeStep < questionsLength - 1 ? "next" : "finish"} */}
          next
        </Button>
      </Grid>
      <Paper className={props.classes.header}>
        <Typography variant="h6">
          {props.questions[props.activeStep].question}
          <br />
          <span style={{ color: "#f44336" }}>
            {`1 - ${props.questions[props.activeStep].keywords[0]}`}
          </span>
          <br />
          <span style={{ color: "#4caf50" }}>
            {`9 - ${props.questions[props.activeStep].keywords[1]}`}
          </span>
        </Typography>
      </Paper>
      <Paper className={props.classes.optionsSection}>
        <Grid container>
          <FormControl component="fieldset">
            <RadioGroup
              style={{
                height: "100%",
                justifyContent: "space-between",
              }}
              aria-label="scale"
              name="scale of 9"
              value={response}
              onChange={handleChange}
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
          <Box className={props.classes.imageScrollBox}>
            {imageRef.map((url, key) => {
              return (
                <img
                  key={key}
                  className={props.classes.img}
                  src={url}
                  alt={key}
                />
              );
            })}
          </Box>
        </Grid>
      </Paper>
    </>
  );
};
const QuestionType3 = (props) => {
  const [response, setResponse] = useState();
  const [valid, setValid] = useState(false);
  const handleChange = (e) => {
    console.log(e.target.value);
    validate(e.target.value);
  };

  const validate = (value) => {
    let res = [];
    let str = value.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
    str.map((s) => {
      let trimStr = s.trim();
      if (trimStr.length > 0) {
        res.push(trimStr);
      }
    });
    if (res.length > 29) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const handleNext = () => {
    // props.setResponses((prev) => {
    //   const newState = prev;
    //   newState[props.activeStep] = response;
    //   return newState;
    // });
    // setValidated(false);
    // setResponse("x");
    // props.handleNext();
  };

  const handleBack = () => {
    // if (validated)
    //   props.setResponses((prev) => {
    //     const newState = prev;
    //     newState[props.activeStep] = response;
    //     return newState;
    //   });
    // setResponse("x");
    props.handleBack();
  };

  return (
    <>
      <Grid container className={props.classes.stepButtonsContainer}>
        <Button
          variant="contained"
          onClick={handleBack}
          className={props.classes.stepButtons}
        >
          back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={props.classes.stepButtons}
          disabled={!valid && !props.responses[props.activeStep]}
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
      <FormControl fullWidth variant="outlined">
        {/* <InputLabel htmlFor="journal-entry">My thoughts today</InputLabel> */}
        <OutlinedInput
          multiline
          rows={10}
          rowsMax={20}
          id="journal-entry"
          // value={values.amount}
          onChange={handleChange}
          // labelWidth={120}
        />
        <Typography variant="caption" display="block" gutterBottom>
          Minimum 30 words.
        </Typography>
      </FormControl>
      <Paper className={props.classes.optionsSection}>
        <Typography variant="h6" className={props.classes.subHeading}>
          What did you write about today?
          <br />
          (Select all that apply)
        </Typography>
        <FormGroup row>
          {props.questions[props.activeStep].tags.map((tag) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    // checked={state.checkedB}
                    // onChange={handleChange}
                    name={tag}
                    color="primary"
                  />
                }
                label={tag}
              />
            );
          })}
        </FormGroup>
      </Paper>
    </>
  );
};

export default DailyStepper;
