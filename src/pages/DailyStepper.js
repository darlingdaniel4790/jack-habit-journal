import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  OutlinedInput,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { firestoreDB } from "..";
import * as photos from "../assets/emotion_images";
import firebase from "firebase/app";
import { useCookies } from "react-cookie";

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
    backgroundColor:
      theme.palette.type === "light" ? theme.palette.primary.dark : "#e0e0e0",
    color: theme.palette.type === "light" ? "white" : "black",
  },
  img: {
    height: "10rem",
    padding: "1rem",
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
    // flex: 1,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  stepButtonsLeft: {
    // bottom: 0,
    margin: theme.spacing(1),
    position: "absolute",
    left: 0,
    bottom: 0,
    zIndex: 999,
    fontSize: "1.5rem",
    // marginBottom: 0,
    // padding: "0 10px",
  },
  stepButtonsRight: {
    // bottom: 0,
    margin: theme.spacing(1),
    position: "absolute",
    [theme.breakpoints.down("sm")]: {
      right: 0,
    },
    [theme.breakpoints.up("sm")]: {
      right: "15px",
    },
    bottom: 0,
    zIndex: 999,
    fontSize: "1.5rem",
    // marginBottom: 0,
    // padding: "0 10px",
  },
  // stepButtonsContainer: {
  //   position: "absolute",
  //   left: 0,
  //   bottom: 0,
  //   zIndex: 999,
  //   marginBottom: 0,
  //   padding: "0 10px",
  //   justifyContent: "space-between",
  // },
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
  photoRadioContainer: {
    display: "flex",
    width: "inherit",
    justifyContent: "center",
    // "& > *": {
    //   margin: theme.spacing(3),
    // },
  },
}));

const questions = [];

const DailyStepper = (props) => {
  let response;
  const [responses1, setResponses1] = useState({});
  const [responses2, setResponses2] = useState({});
  const [loading, setLoading] = useState(true);
  const [dbFetchError, setDbFetchError] = useState(false);
  const matches = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [centerReached, setCenterReached] = useState(false);
  const [doneForTheDay, setDoneForTheDay] = useState(false);
  const [cookie, setCookie] = useCookies(["theme", "dateStamp"]);
  const ref = useRef();
  // console.log(activeStep);
  // console.log(responses1);
  // console.log(responses2);

  useEffect(() => {
    props.handleDoneForTheDay(doneForTheDay);
  });

  // check timout
  if (cookie.dateStamp) {
    // date cookie exists, check
    if (
      new Date(cookie.dateStamp).getDate() <= new Date().getDate() &&
      new Date(cookie.dateStamp) < new Date()
    ) {
      // new day has come, allow retake
      if (doneForTheDay) {
        setDoneForTheDay(false);
      }
    } else {
      // disable retake
      if (loading) setLoading(false);
      if (!doneForTheDay) setDoneForTheDay(true);
    }
  }

  // refresh every 5 seconds to see if date is reached
  useEffect(() => {
    let timer;
    if (doneForTheDay) {
      timer = setInterval(() => {
        setCenterReached(false);
        console.log("re-rendering");
      }, 3000);
    } else {
      clearInterval(timer);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [doneForTheDay]);

  // fetch questions from firestore
  useEffect(() => {
    if (doneForTheDay) return;
    firestoreDB
      .collection("survey-questions")
      .orderBy("position", "asc")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          questions.push(doc.data());
        });
        if (questions.length < 1) {
          setDbFetchError(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setDbFetchError(true);
      });
    return () => {};
  }, [doneForTheDay]);

  // write answers to firestore
  const uploadToFirestore = () => {
    response = {
      pre: { ...responses1 },
      post: { ...responses2 },
    };
    setResponses1({});
    setResponses2({});
    response = JSON.stringify(response);
    firestoreDB
      .collection("responses")
      .doc(props.userInfo.uid)
      .collection("responses")
      .doc()
      .set({
        date: firebase.firestore.Timestamp.now(),
        response,
      })
      .then(() => {
        console.log("answers uploaded");
        setDoneForTheDay(true);
        // set the timout duration for retake
        let newStamp = new Date();
        newStamp.setDate(newStamp.getDate() + 1);
        setCookie("dateStamp", newStamp);
        setActiveStep(0);
        setCenterReached(false);
      })
      .catch((error) => {
        console.error("error adding answers: ", error);
      })
      .finally(() => setLoading(false));
  };

  const handleNext = () => {
    ref.current.scrollIntoViewIfNeeded();
    // ref.current.scrollIntoView({
    //   behavior: "smooth",
    //   inline: "nearest",
    //   block: "end",
    // });

    // if (centerReached) {
    //   // center reached, second half of questions
    //   if (activeStep < questions.length - 2) {
    //     // normal navigation
    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //   } else {
    //     // done for the day
    //     // upload to db
    //     setLoading(true);
    //     uploadToFirestore();
    //   }
    // } else {
    //   // center not reached, first half of questions
    //   if (questions[activeStep].type === 3) {
    //     // midway point, trigger centerReached
    //     setActiveStep(0);
    //     setCenterReached(true);
    //   } else {
    //     // normal navigation
    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //   }
    // }
    if (activeStep === questions.length - 1) {
      // done for the day
      // upload to db
      setLoading(true);
      uploadToFirestore();
    } else {
      setActiveStep((prevActiveStep) => {
        props.handleProgress(prevActiveStep + 1, questions.length);
        return prevActiveStep + 1;
      });
    }
  };

  const handleBack = () => {
    // if (centerReached) {
    //   // center reached, second half of questions
    //   if (activeStep === 0) {
    //     // first question, so toggle centerReached
    //     // setActiveStep to last question
    //     setActiveStep(questions.length - 1);
    //     setCenterReached(false);
    //   } else {
    //     // normal navigation
    //     setActiveStep((prevActiveStep) => prevActiveStep - 1);
    //   }
    // } else {
    //   // center not reached, first half of questions
    //   // normal navigation
    //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // }
    setActiveStep((prevActiveStep) => {
      props.handleProgress(prevActiveStep - 1, questions.length);
      return prevActiveStep - 1;
    });
  };
  let questionShown = "";
  if (!loading && !doneForTheDay && questions.length > 0) {
    switch (questions[activeStep].type) {
      // scale 1-5 multi questions
      case 1:
        questionShown = (
          <QuestionType1
            {...questions[activeStep]}
            keyLabel={questions[activeStep].key}
            classes={classes}
            matches={matches}
            responses={centerReached ? responses2 : responses1}
            setResponses={centerReached ? setResponses2 : setResponses1}
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            centerReached={centerReached}
          />
        );
        break;

      // scale 1-9 images
      case 2:
        questionShown = (
          <QuestionType2
            questions={questions}
            keyLabel={questions[activeStep].key}
            classes={classes}
            matches={matches}
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            responses={centerReached ? responses2 : responses1}
            setResponses={centerReached ? setResponses2 : setResponses1}
            cookie={cookie}
          />
        );
        break;

      // open writing question and center point of survey
      case 3:
        questionShown = (
          <QuestionType3
            questions={questions}
            keyLabel={questions[activeStep].key}
            classes={classes}
            matches={matches}
            activeStep={activeStep}
            handleNext={handleNext}
            handleBack={handleBack}
            responses={responses1}
            setResponses={setResponses1}
            centerReached={centerReached}
            setCenterReached={setCenterReached}
          />
        );
        break;

      default:
        break;
    }
  } else if (doneForTheDay) {
    questionShown = (
      <Grid
        container
        justify="center"
        direction="column"
        alignItems="center"
        style={{ height: "80vh" }}
      >
        <Typography variant="h4" align="center">
          <DoneAllIcon fontSize="inherit" />
          <br />
          You're all done for today.
        </Typography>
        <Typography variant="subtitle1" align="center">
          See you tomorrow.
        </Typography>
      </Grid>
    );
  }

  if (!loading && dbFetchError) {
    questionShown = (
      <Typography variant="h6" align="center">
        There's been an error fetching the data.
      </Typography>
    );
  }

  return (
    <Grid item md={9} className={classes.root}>
      <div ref={ref} style={{ margin: 0 }}></div>
      {loading ? (
        <Grid
          style={{ height: "80vh" }}
          container
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
  let initialState = [];
  const [validated, setValidated] = useState(false);
  if (props.responses[props.keyLabel]) {
    initialState = props.responses[props.keyLabel];
  } else {
    initialState = props.questions.map((item, index) => {
      return {
        question: index + 1,
        value: "",
        numValue: 0,
      };
    });
  }
  const [responses, setResponses] = useState(initialState);

  const validate = () => {
    let control = false;
    responses.every((item) => {
      if (!item.value) {
        control = false;
        return false;
      }
      control = true;
      return true;
    });
    if (control) {
      setValidated(control);
      props.setResponses((prev) => {
        const newState = prev;
        newState[props.keyLabel] = responses;
        return newState;
      });
    }
  };

  useEffect(() => {
    validate();
  });

  const handleChange = (e) => {
    let numValue;
    switch (e.target.value) {
      case "stronglyDisagree":
        numValue = 1;
        break;
      case "disagree":
        numValue = 2;
        break;
      case "notSure":
        numValue = 3;
        break;
      case "agree":
        numValue = 4;
        break;
      case "stronglyAgree":
        numValue = 5;
        break;

      default:
        break;
    }
    setResponses((prev) => {
      const newValue = prev;
      newValue[e.target.name].value = e.target.value;
      newValue[e.target.name].numValue = numValue;
      return [...newValue];
    });
  };

  const handleNext = () => {
    props.handleNext();
  };

  const handleBack = () => {
    props.setResponses((prev) => {
      const newState = prev;
      newState[props.keyLabel] = responses;
      return newState;
    });
    props.handleBack();
  };
  return (
    <>
      <Grid container>
        <Button
          variant="contained"
          onClick={handleBack}
          disabled={props.activeStep < 1}
          className={props.classes.stepButtonsLeft}
        >
          back
        </Button>
        <Button
          variant="contained"
          disabled={!validated}
          onClick={handleNext}
          className={props.classes.stepButtonsRight}
        >
          {props.centerReached && props.activeStep === questions.length - 1
            ? "finish"
            : "next"}
        </Button>
      </Grid>
      <Paper className={props.classes.header}>
        <Typography variant="h6">{props.question}</Typography>
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
  let initialState = "x";
  const [validated, setValidated] = useState(false);
  const [response, setResponse] = useState(initialState);
  if (props.responses[props.keyLabel]) {
    if (response === "x") {
      setResponse(props.responses[props.keyLabel]);
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
      newState[props.keyLabel] = response;
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
        newState[props.keyLabel] = response;
        return newState;
      });
    setResponse("x");
    props.handleBack();
  };

  let imageRef = [];
  switch (props.questions[props.activeStep].key) {
    case "EmotionValence":
      imageRef = [
        photos.happy1,
        photos.happy2,
        photos.happy3,
        photos.happy4,
        photos.happy5,
        photos.happy6,
        photos.happy7,
        photos.happy8,
        photos.happy9,
      ];
      break;
    case "EmotionArousal":
      imageRef = [
        photos.arousal1,
        photos.arousal2,
        photos.arousal3,
        photos.arousal4,
        photos.arousal5,
        photos.arousal6,
        photos.arousal7,
        photos.arousal8,
        photos.arousal9,
      ];
      break;
    case "EmotionDominance":
      imageRef = [
        photos.control1,
        photos.control2,
        photos.control3,
        photos.control4,
        photos.control5,
        photos.control6,
        photos.control7,
        photos.control8,
        photos.control9,
      ];
      break;

    default:
      break;
  }
  return (
    <>
      <Grid container>
        <Button
          variant="contained"
          onClick={handleBack}
          className={props.classes.stepButtonsLeft}
        >
          back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          className={props.classes.stepButtonsRight}
          disabled={!validated && !props.responses[props.keyLabel]}
        >
          next
        </Button>
      </Grid>
      <Paper className={props.classes.header}>
        <Typography variant="h6">
          {props.questions[props.activeStep].question}
          <br />
          {`1 - ${props.questions[props.activeStep].keywords[0]}`}
          <br />
          {`9 - ${props.questions[props.activeStep].keywords[1]}`}
        </Typography>
      </Paper>
      <Paper className={props.classes.optionsSection}>
        <Grid container>
          <Grid item className={props.classes.photoRadioContainer}>
            <FormControl component="fieldset">
              <RadioGroup
                style={{
                  height: "100%",
                  justifyContent: "space-around",
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
                if (response !== "x") {
                  if (parseInt(response) === key + 1) {
                    return (
                      <img
                        key={key}
                        className={props.classes.img}
                        src={url}
                        alt={key}
                        style={{
                          opacity: "100%",
                          borderRadius: "10%",
                          border: `${
                            props.cookie.theme === "dark"
                              ? "3px solid white"
                              : "3px solid black"
                          }`,
                        }}
                      />
                    );
                  } else {
                    return (
                      <img
                        key={key}
                        className={props.classes.img}
                        src={url}
                        alt={key}
                        style={{ opacity: "40%" }}
                      />
                    );
                  }
                }
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
        </Grid>
      </Paper>
    </>
  );
};
const QuestionType3 = (props) => {
  const [valid, setValid] = useState(false);
  let initialState;
  if (props.responses[props.keyLabel]) {
    initialState = props.responses[props.keyLabel];
    if (!valid) setValid(true);
  } else {
    let tagState = props.questions[props.activeStep].tags.map((item) => {
      return {
        tag: item,
        value: false,
      };
    });
    initialState = ["", tagState];
  }
  const [response, setResponse] = useState(initialState);
  const minWords = 5;
  const handleChange = (e) => {
    setResponse((prev) => {
      prev[0] = e.target.value;
      return [...prev];
    });
    validate(e.target.value);
  };

  const handleTagChange = (e) => {
    setResponse((prev) => {
      prev[1][e.target.name].value = !prev[1][e.target.name].value;
      return [...prev];
    });
  };

  const validate = (value) => {
    let strLength = value.match(/\S+/g).length;
    if (strLength >= minWords) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const handleNext = () => {
    props.setResponses((prev) => {
      const newState = prev;
      newState[props.keyLabel] = response;
      return newState;
    });
    props.setCenterReached(true);
    props.handleNext();
  };

  const handleBack = () => {
    if (valid)
      props.setResponses((prev) => {
        const newState = prev;
        newState[props.keyLabel] = response;
        return newState;
      });
    props.setCenterReached(false);
    props.handleBack();
  };

  return (
    <>
      <Grid container>
        <Button
          variant="contained"
          onClick={handleBack}
          className={props.classes.stepButtonsLeft}
        >
          back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          className={props.classes.stepButtonsRight}
          disabled={!valid && !props.responses[props.keyLabel]}
        >
          next
        </Button>
      </Grid>
      <Paper className={props.classes.header}>
        <Typography variant="h6">
          {props.questions[props.activeStep].question}
        </Typography>
      </Paper>
      <FormControl fullWidth variant="outlined">
        <OutlinedInput
          multiline
          rows={10}
          rowsMax={20}
          id="journal-entry"
          value={response[0]}
          onChange={handleChange}
        />
        <Typography variant="caption" display="block" gutterBottom>
          Minimum {minWords} words.
        </Typography>
      </FormControl>
      <Paper className={props.classes.optionsSection}>
        <Typography variant="h6" className={props.classes.subHeading}>
          What did you write about today?
          <br />
          (Select all that apply)
        </Typography>
        <FormGroup row>
          {props.questions[props.activeStep].tags.map((tag, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={response[1][index].value}
                    onChange={handleTagChange}
                    name={"" + index}
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
