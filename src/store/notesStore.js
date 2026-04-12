import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    activeFolderId: null,
    activeNoteId: null,
    activeCategory: "all",
    activeDrawer: null, // "folders" or "notes" for mobile view
    theme: "dark",
  },
  reducers: {
    setActiveDrawer: (state, action) => {
      state.activeDrawer = action.payload;
    },
    setActiveFolder: (state, action) => {
      state.activeFolderId = action.payload;
    },
    setActiveNote: (state, action) => {
      state.activeNoteId = action.payload;
    },
    setCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const {
  setActiveFolder,
  setActiveNote,
  setCategory,
  setActiveDrawer,
  toggleTheme,
} = notesSlice.actions;
export default notesSlice.reducer;
