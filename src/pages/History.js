import { Grid, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { firestoreDB } from "..";
import Paper from "@material-ui/core/Paper";
import { useState } from "react";
import firebase from "firebase/app";

const History = (props) => {
  const [list, setList] = useState("");
  // fetch from firestore
  useEffect(() => {
    let output = [];
    firestoreDB
      .collection("responses")
      .doc(props.userInfo.uid)
      .collection("responses")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          output.push(doc);
        });
        output = output.map((doc, index) => {
          let date = new firebase.firestore.Timestamp(
              doc.data().date.seconds,
              doc.data().date.nanoseconds
            ).toDate(),
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear();
          // console.log(JSON.parse(doc.data().response));
          return (
            <Paper key={index}>
              <Grid container fluid="true" direction="column">
                <Typography
                  variant="h6"
                  align="right"
                >{`${day}-${month}-${year}`}</Typography>
                <Typography variant="h4">Journal Entry</Typography>
                <Typography variant="h5">
                  {/* {JSON.parse(doc.data().response)[5][0]} */}
                </Typography>
              </Grid>
            </Paper>
          );
        });
        setList(output);
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {};
  }, [props.userInfo.uid]);

  return <Grid container>{list}</Grid>;
};

History.propTypes = {};

export default History;
