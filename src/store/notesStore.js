import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme;

  // Optional: Check system preference if no saved theme exists
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    activeFolderId: null,
    activeNoteId: null,
    activeCategory: "all",
    activeResourcesCategory: "all",
    activeDrawer: null, // "folders" or "notes" for mobile view
    theme: getInitialTheme(),
  },
  reducers: {
    setActiveDrawer: (state, action) => {
      state.activeDrawer = action.payload;
    },
    setActiveFolder: (state, action) => {
      state.activeFolderId = action.payload;
      state.activeCategory = "all";
    },
    setActiveNote: (state, action) => {
      state.activeNoteId = action.payload;
      state.activeResourcesCategory = "all";
    },
    setCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setActiveResourcesCategory: (state, action) => {
      state.activeResourcesCategory = action.payload;
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
  setActiveResourcesCategory,
  setActiveDrawer,
  toggleTheme,
} = notesSlice.actions;
export default notesSlice.reducer;
