import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import React from "react";

const tutorialSteps = [
  {
    label: "San Francisco – Oakland Bay Bridge, United States",
    imgPath:
      "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bird",
    imgPath:
      "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bali, Indonesia",
    imgPath:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80",
  },
  {
    label: "NeONBRAND Digital Marketing, Las Vegas, United States",
    imgPath:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Goč, Serbia",
    imgPath:
      "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
  },
];
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "93%",
    "& > *": {
      marginBottom: theme.spacing(1),
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  img: {
    height: 255,
  },
  mobileStepper: {
    flex: 1,
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
}));

const DailyStepper = (props) => {
  const matches = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Grid container direction="column" className={classes.root}>
      <Paper className={classes.header}>
        <Typography>{tutorialSteps[activeStep].label}</Typography>
      </Paper>
      <Paper className={classes.optionsSection}>
        <Typography>The options for the answers will be here.</Typography>
        <Box
          className={classes.scrollBox}
          style={{ maxWidth: `${matches ? "90vw" : "78vw"}` }}
        >
          <img
            className={classes.img}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].label}
          />
          <img
            className={classes.img}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].label}
          />
          <img
            className={classes.img}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].label}
          />
          <img
            className={classes.img}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].label}
          />
          <img
            className={classes.img}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].label}
          />
          <img
            className={classes.img}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].label}
          />
        </Box>
      </Paper>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        className={classes.mobileStepper}
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Grid>
  );
};

export default DailyStepper;
