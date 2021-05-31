import { createSlice } from "@reduxjs/toolkit";
import firebase from "firebase/app";

const initialState = {
  isLoggedIn: false,
  displayName: "",
  photoUrl: "",
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      console.log("logged in");
    },
    logout(state) {
      state.isLoggedIn = false;
      firebase.auth().signOut();
    },
    setDisplayName(state, action) {
      state.displayName = action.payload;
      console.log("name set");
    },
    setPhotoUrl(state, action) {
      state.photoUrl = action.payload;
    },
  },
});

export const userAuthActions = userAuthSlice.actions;

export default userAuthSlice.reducer;
