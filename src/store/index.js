import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./userAuthSlice";

const store = configureStore({
  reducer: { userAuth: userAuthSlice },
});

export default store;
