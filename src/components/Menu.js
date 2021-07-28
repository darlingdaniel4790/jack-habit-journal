import AppBar from "@material-ui/core/AppBar";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React, { useState } from "react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import TodayIcon from "@material-ui/icons/Today";
import HistoryIcon from "@material-ui/icons/History";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DailyStepper from "../pages/DailyStepper";
import History from "../pages/History";
import { useCookies } from "react-cookie";
import { Avatar, LinearProgress } from "@material-ui/core";
import { Brightness3, Brightness7 } from "@material-ui/icons";

const drawerWidth = 240;

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor:
      theme.palette.type === "light" ? theme.palette.primary.dark : "#e0e0e0",
  },
}))(LinearProgress);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
    color: theme.palette.type === "light" ? "black" : "white",
  },
  toolbar: {
    justifyContent: "space-between",
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    // marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
  },
  content: {
    height: "100vh",
    width: "100vw",
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    overflowX: "hidden",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Menu(props) {
  const [cookies, setCookies] = useCookies(["theme"]);
  const [isDarkMode, setIsDarkMode] = useState(() => cookies.theme === "dark");
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [progress, setProgress] = useState(0);
  const [doneForTheDay, setDoneForTheDay] = useState(true);

  const handleProgress = (activeStep, questionsLength) => {
    setProgress((activeStep * 100) / (questionsLength - 1));
  };

  const handleDoneForTheDay = (done) => {
    if (done && !doneForTheDay) {
      setDoneForTheDay(true);
    } else if (!done && doneForTheDay) {
      setDoneForTheDay(false);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const switchDisplayMode = () => {
    setIsDarkMode((prevState) => !prevState);
    if (!isDarkMode) {
      setCookies("theme", "dark");
    } else {
      setCookies("theme", "light");
    }
  };
  const menuTextColor = isDarkMode ? "white" : "initial";

  let title;
  switch (window.location.pathname) {
    case "/":
      title = "Daily Journaling";
      break;
    case "/daily-stepper":
      title = "Daily Journaling";
      break;
    case "/history":
      title = "History";
      break;

    default:
      break;
  }

  if (title !== "Daily Journaling" && progress !== 0) {
    setProgress(0);
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          <Avatar
            alt={props.userInfo.displayName}
            src={props.userInfo.photoURL}
          ></Avatar>
        </Toolbar>
        {!doneForTheDay && title === "Daily Journaling" && (
          <BorderLinearProgress variant="determinate" value={progress} />
        )}
      </AppBar>
      <Router>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={switchDisplayMode}>
              {isDarkMode ? <Brightness7 /> : <Brightness3 />}
            </IconButton>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link
              style={{
                textDecoration: "none",
                color: menuTextColor,
              }}
              to="/daily-stepper"
            >
              <ListItem button onClick={handleDrawerClose}>
                <ListItemIcon>
                  <TodayIcon />
                </ListItemIcon>
                <ListItemText primary="Today" />
              </ListItem>
            </Link>
            <Link
              style={{ textDecoration: "none", color: menuTextColor }}
              to="/history"
            >
              <ListItem button onClick={handleDrawerClose}>
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="History" />
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => props.handleLogout()}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>
            <ListItem></ListItem>
          </List>
        </Drawer>

        <main className={clsx(classes.content)}>
          <div className={classes.drawerHeader} />
          <Switch>
            <Route path="/history">
              <History userInfo={props.userInfo} />
            </Route>
            <Route path={["/", "/daily-stepper"]}>
              <DailyStepper
                userInfo={props.userInfo}
                handleProgress={handleProgress}
                handleDoneForTheDay={handleDoneForTheDay}
                doneForTheDay={doneForTheDay}
              />
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
}
