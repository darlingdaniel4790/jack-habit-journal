import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { firestoreDB } from "..";
// import Paper from "@material-ui/core/Paper";
import { useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const History = (props) => {
  const [list, setList] = useState("");
  const [loading, setLoading] = useState(true);
  // fetch from firestore
  useEffect(() => {
    let output = [];
    firestoreDB
      .collection("responses")
      .where("id", "==", props.userInfo.uid)
      // .orderBy("date", "desc") // doesn't work with ==
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          output.push(doc);
        });
        output = output.map((doc, index) => {
          let date = doc.data().date.toDate(),
            day = date.getDate(),
            month = months[date.getMonth()],
            year = date.getFullYear();
          const responseArray = JSON.parse(doc.data().response);
          return (
            <Grid item md={9} key={index} style={{ width: "100%" }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h5">{`${day}-${month}-${year}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container direction="column" spacing={1}>
                    <Typography variant="h6" color="secondary">
                      You indicated these topics
                    </Typography>
                    <Typography variant="body1">
                      {responseArray.pre.JournalEntry[1].map((data, index) => {
                        if (data.value === true) {
                          if (
                            index ===
                            responseArray.pre.JournalEntry[1].length - 1
                          )
                            return " | " + data.tag + " | ";
                          return " | " + data.tag;
                        }
                        if (
                          index ===
                          responseArray.pre.JournalEntry[1].length - 1
                        )
                          return " | ";
                        return "";
                      })}
                    </Typography>
                    <br />
                    <Typography variant="h6" color="secondary">
                      Journal Entry
                    </Typography>
                    <TextField
                      id="terms"
                      label=""
                      variant="filled"
                      multiline
                      fullWidth
                      defaultValue={responseArray.pre.JournalEntry[0]}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    {/* <Typography variant="subtitle2">
                      Pre-Journal Responses
                      <p>{doc.data().response}</p>
                    </Typography>
                    <Typography variant="subtitle2">
                      Post-Journal Responses
                      <p>{doc.data().response}</p>
                    </Typography> */}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            // <Paper key={index}>
            //   <Grid container fluid="true" direction="column">
            //     <Typography
            //       variant="h6"
            //       align="right"
            //     >{`${day}-${month}-${year}`}</Typography>
            //     <Typography variant="h4">Journal Entry</Typography>
            //     <Typography variant="h5">
            //       {/* {JSON.parse(doc.data().response)[5][0]} */}
            //     </Typography>
            //   </Grid>
            // </Paper>
          );
        });
        setList(output);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {};
  }, [props.userInfo.uid]);

  return (
    <Grid container direction="column" alignContent="center" spacing={2}>
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
        list
      )}
    </Grid>
  );
};

History.propTypes = {};

export default History;
