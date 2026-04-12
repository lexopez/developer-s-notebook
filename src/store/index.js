import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./notesStore";

const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

export default store;
