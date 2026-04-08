import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./newStore";

const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

export default store;
