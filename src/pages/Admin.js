import { Button } from "@material-ui/core";
import { parse } from "json2csv";
import { firestoreDB } from "..";

const Admin = (props) => {
  const downloadData = () => {
    let objects = [];
    console.log("data processing...");
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
  return (
    <>
      <Button variant="outlined" onClick={downloadData}>
        Download Latest Data
      </Button>
      <Button variant="outlined" onClick={props.handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default Admin;
