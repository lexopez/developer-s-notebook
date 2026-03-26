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
      title: "React js",
      data: {
        "code snippets": [
          {
            id: "c1",
            label: "Counter Hook",
            code: "const [count, setCount] = useState(0);",
          },
          {
            id: "c2",
            label: "useEffect Cleanup",
            code: "return () => clearInterval(timer);",
          },
        ],
        "side projects": [
          { id: "p1", name: "Weather Dashboard", status: "In Progress" },
        ],
        resources: [{ id: "r1", title: "Beta React Docs", url: "react.dev" }],
        notes: [{ id: "g1", text: "Remember that props are read-only." }],
      },
    },
    {
      id: "n2",
      folderId: "f1",
      title: "Tailwind Config",
      data: {
        "code snippets": [
          {
            id: "c1",
            label: "Counter Hook",
            code: "const [count, setCount] = useState(0);",
          },
          {
            id: "c2",
            label: "useEffect Cleanup",
            code: "return () => clearInterval(timer);",
          },
        ],
        "side projects": [
          { id: "p1", name: "Weather Dashboard", status: "In Progress" },
        ],
        resources: [{ id: "r1", title: "Beta React Docs", url: "react.dev" }],
        notes: [{ id: "g1", text: "Remember that props are read-only." }],
      },
    },
    {
      id: "n3",
      folderId: "f2",
      title: "Node 25 Features",
      data: {
        "code snippets": [
          {
            id: "c1",
            label: "Counter Hook",
            code: "const [count, setCount] = useState(0);",
          },
          {
            id: "c2",
            label: "useEffect Cleanup",
            code: "return () => clearInterval(timer);",
          },
        ],
        "side projects": [
          { id: "p1", name: "Weather Dashboard", status: "In Progress" },
        ],
        resources: [{ id: "r1", title: "Beta React Docs", url: "react.dev" }],
        notes: [{ id: "g1", text: "Remember that props are read-only." }],
      },
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
    addFolder: (state, action) => {
      const newFolder = {
        id: Date.now().toString(), // Temporary ID until Supabase
        name: action.payload,
      };
      state.folders.push(newFolder);
    },
    addNote: (state, action) => {
      const newNote = {
        id: Date.now().toString(),
        folderId: state.activeFolderId,
        title: action.payload,
        data: {
          "code snippets": [],
          "side projects": [],
          resources: [],
          notes: [],
        },
      };
      state.notes.push(newNote);
      state.activeNoteId = newNote.id; // Auto-select new note
    },
  },
});

export const {
  setActiveFolder,
  setActiveNote,
  setCategory,
  toggleTheme,
  addNote,
  addFolder,
} = notesSlice.actions;
export default notesSlice.reducer;
