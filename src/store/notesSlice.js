// store/notesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [
    { id: "f1", name: "Frontend Tips" },
    { id: "f2", name: "Backend Docs" },
  ],
  notes: [
    {
      id: "n1",
      folderId: "f1",
      title: "Vue Composition API",
      category: "code snippets",
      content: "const count = ref(0);",
    },
    {
      id: "n2",
      folderId: "f1",
      title: "Tailwind Config",
      category: "resources",
      content: 'module.exports = { darkMode: "class" }',
    },
    {
      id: "n3",
      folderId: "f2",
      title: "Node 25 Features",
      category: "notes",
      content: "Check out the new V8 engine updates.",
    },
  ],
  activeFolderId: "f1",
  activeCategory: "all",
  activeNoteId: "n1", // Track the selected note
  theme: "dark",
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setActiveFolder: (state, action) => {
      state.activeFolderId = action.payload;
      // Reset active note to the first one in the new folder
      const firstNote = state.notes.find((n) => n.folderId === action.payload);
      state.activeNoteId = firstNote ? firstNote.id : null;
    },
    setCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setActiveNote: (state, action) => {
      state.activeNoteId = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { setActiveFolder, setActiveNote, setCategory, toggleTheme } =
  notesSlice.actions;
export default notesSlice.reducer;
