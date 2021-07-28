import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { parse } from "json2csv";
import { useEffect, useState } from "react";
import { firestoreDB } from "..";
// import firebase from "firebase/app";

const Admin = (props) => {
  const [users, setUsers] = useState();
  const [emailArray, setEmailArray] = useState();
  const [responses, setResponses] = useState();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let tempUsers = [];
    let tempResponses = [];
    firestoreDB
      .collection("participants")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          tempUsers.push({
            id: doc.data().id,
            email: doc.data().email,
          });
        });
        firestoreDB
          .collection("responses")
          // .where("date", "<=", date24)
          // .where("email", "==", "ddarlingdaniel4790@gmail.com")
          .orderBy("date", "desc")
          .limit(tempUsers.length * 2)
          .get()
          .then((snapshot) => {
            // console.log(snapshot.docs[0].data());
            snapshot.forEach((doc) => {
              // console.log(doc.data().date.toDate());
              // if (doc.data().date.toDate() <= date24) console.log("yes");
              // else console.log("no");
              // console.log(doc.data().email);
              tempResponses.push({
                id: doc.data().id,
                date: doc.data().date,
              });
            });
            setResponses(tempResponses);
          })
          .catch((e) => {});

        setUsers(tempUsers);
      })
      .catch((e) => {});

    return () => {};
  }, []);

  // console.log(users, responses);
  // console.log(responses, users, !emailArray);
  if (responses && users && !emailArray) {
    // console.log("here");
    let date24 = new Date();
    date24.setHours(date24.getHours() - 24);
    let tempEmailArray = [];
    users.forEach((user) => {
      let addToSendList = true;
      responses.forEach((response) => {
        if (user.id === response.id && response.date.toDate() > date24) {
          // don't send to this user
          addToSendList = false;
        }
      });
      if (addToSendList) {
        tempEmailArray.push(user.email);
      }
    });
    setEmailArray(tempEmailArray);
    // console.log(tempEmailArray);
  }

  const downloadData = () => {
    let objects = [];
    // console.log("data processing...");
    firestoreDB
      .collection("responses")
      .get()
      .then((snapshot) => {
        let item = {};
        snapshot.forEach((doc) => {
          let data = doc.data();
          let response = JSON.parse(data.response);
          let date = data.date.toDate();
          item = {
            UserID: data.id,

            UserName: data.name,

            UserEmail: data.email,

            JournalDate: date,

            PreResilienceAssessmentQ1Value:
              response.pre.ResilienceAssessment[0].numValue,
            PreResilienceAssessmentQ1Text:
              response.pre.ResilienceAssessment[0].value,

            PreResilienceAssessmentQ2Value:
              response.pre.ResilienceAssessment[1].numValue,
            PreResilienceAssessmentQ2Text:
              response.pre.ResilienceAssessment[1].value,

            PreResilienceAssessmentQ3Value:
              response.pre.ResilienceAssessment[2].numValue,
            PreResilienceAssessmentQ3Text:
              response.pre.ResilienceAssessment[2].value,

            PreResilienceAssessmentQ4Value:
              response.pre.ResilienceAssessment[3].numValue,
            PreResilienceAssessmentQ4Text:
              response.pre.ResilienceAssessment[3].value,

            PreResilienceAssessmentQ5Value:
              response.pre.ResilienceAssessment[4].numValue,
            PreResilienceAssessmentQ5Text:
              response.pre.ResilienceAssessment[4].value,

            PreResilienceAssessmentQ6Value:
              response.pre.ResilienceAssessment[5].numValue,
            PreResilienceAssessmentQ6Text:
              response.pre.ResilienceAssessment[5].value,

            PreResilienceAssessmentQ7Value:
              response.pre.ResilienceAssessment[6].numValue,
            PreResilienceAssessmentQ7Text:
              response.pre.ResilienceAssessment[6].value,

            PreResilienceAssessmentQ8Value:
              response.pre.ResilienceAssessment[7].numValue,
            PreResilienceAssessmentQ8Text:
              response.pre.ResilienceAssessment[7].value,

            PreResilienceAssessmentQ9Value:
              response.pre.ResilienceAssessment[8].numValue,
            PreResilienceAssessmentQ9Text:
              response.pre.ResilienceAssessment[8].value,

            PreResilienceAssessmentQ10Value:
              response.pre.ResilienceAssessment[9].numValue,
            PreResilienceAssessmentQ10Text:
              response.pre.ResilienceAssessment[9].value,

            PreEmotionValence: response.pre.EmotionValence,

            PreEmotionArousal: response.pre.EmotionArousal,

            PreEmotionDominance: response.pre.EmotionDominance,

            PreBasicEmotionsQ1Value: response.pre.BasicEmotions[0].numValue,
            PreBasicEmotionsQ1Text: response.pre.BasicEmotions[0].value,

            PreBasicEmotionsQ2Value: response.pre.BasicEmotions[1].numValue,
            PreBasicEmotionsQ2Text: response.pre.BasicEmotions[1].value,

            PreBasicEmotionsQ3Value: response.pre.BasicEmotions[2].numValue,
            PreBasicEmotionsQ3Text: response.pre.BasicEmotions[2].value,

            PreBasicEmotionsQ4Value: response.pre.BasicEmotions[3].numValue,
            PreBasicEmotionsQ4Text: response.pre.BasicEmotions[3].value,

            PreBasicEmotionsQ5Value: response.pre.BasicEmotions[4].numValue,
            PreBasicEmotionsQ5Text: response.pre.BasicEmotions[4].value,

            PreBasicEmotionsQ6Value: response.pre.BasicEmotions[5].numValue,
            PreBasicEmotionsQ6Text: response.pre.BasicEmotions[5].value,

            JournalEntry: response.pre.JournalEntry[0],

            JournalEntryTagSleep: response.pre.JournalEntry[1][0].value,

            JournalEntryTagNutrition: response.pre.JournalEntry[1][1].value,

            JournalEntryTagFitness: response.pre.JournalEntry[1][2].value,

            JournalEntryTagFinance: response.pre.JournalEntry[1][3].value,

            JournalEntryTagRelationships: response.pre.JournalEntry[1][4].value,

            JournalEntryTagProblemSolving:
              response.pre.JournalEntry[1][5].value,

            JournalEntryTagGratitude: response.pre.JournalEntry[1][6].value,

            JournalEntryTagMindfulness: response.pre.JournalEntry[1][7].value,

            JournalEntryTagValues: response.pre.JournalEntry[1][8].value,

            JournalEntryTagMentalHealth: response.pre.JournalEntry[1][9].value,

            JournalEntryTagOther: response.pre.JournalEntry[1][10].value,

            PostEmotionValence: response.post.EmotionValence,

            PostEmotionArousal: response.post.EmotionArousal,

            PostEmotionDominance: response.post.EmotionDominance,

            PostBasicEmotionsQ1Value: response.post.BasicEmotions[0].numValue,
            PostBasicEmotionsQ1Text: response.post.BasicEmotions[0].value,

            PostBasicEmotionsQ2Value: response.post.BasicEmotions[1].numValue,
            PostBasicEmotionsQ2Text: response.post.BasicEmotions[1].value,

            PostBasicEmotionsQ3Value: response.post.BasicEmotions[2].numValue,
            PostBasicEmotionsQ3Text: response.post.BasicEmotions[2].value,

            PostBasicEmotionsQ4Value: response.post.BasicEmotions[3].numValue,
            PostBasicEmotionsQ4Text: response.post.BasicEmotions[3].value,

            PostBasicEmotionsQ5Value: response.post.BasicEmotions[4].numValue,
            PostBasicEmotionsQ5Text: response.post.BasicEmotions[4].value,

            PostBasicEmotionsQ6Value: response.post.BasicEmotions[5].numValue,
            PostBasicEmotionsQ6Text: response.post.BasicEmotions[5].value,
          };
          objects.push(item);
        });
        try {
          const csv = parse(objects);
          download(csv, "response.csv", "text/plain");
        } catch (err) {
          console.error(err);
        }
      });
  };
  const download = (content, fileName, contentType) => {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

  const copy = () => {
    var copyText = document.querySelector("#emails");
    copyText.select();
    document.execCommand("copy");
    setCopied(true);
  };

  useEffect(() => {
    if (copied)
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    return () => {};
  }, [copied]);

  return (
    <>
      <Grid container direction="column">
        <br />
        {users && emailArray && (
          <>
            <Typography variant="h6">
              {users && users.length} participants registered.{" "}
              {emailArray && emailArray.length} of them haven't journaled in the
              last 24 hours.
            </Typography>
            <FormControl fullWidth>
              <TextField
                multiline
                rows={10}
                rowsMax={20}
                id="emails"
                // value={emailArray&&emailArray.split(";")}
                // onChange={handleChange}
                defaultValue={emailArray && emailArray.join(";\n")}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </>
        )}
        <br />
        {emailArray && (
          <Button variant="contained" onClick={copy}>
            Copy addresses
          </Button>
        )}
        {copied && (
          <Typography
            align="center"
            variant="h5"
            style={{
              position: "fixed",
              bottom: "50%",
              top: "50%",
              left: "0",
              right: "0",
              zIndex: "999",
            }}
          >
            Emails copied to clipboard
          </Typography>
        )}

        <Grid
          direction="column"
          container
          style={{ position: "fixed", bottom: "0", zIndex: "999" }}
        >
          <Button variant="contained" onClick={downloadData}>
            Download Latest Data
          </Button>
          <br />
          <Button variant="contained" onClick={props.handleLogout}>
            Logout
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Admin;
