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
          {
            id: "p1",
            name: "Weather Dashboard",
            url: "https://weather-dashboard.com",
          },
        ],
        resources: [
          { id: "r1", name: "Beta React Docs", url: "https://react.dev" },
        ],
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
          {
            id: "p1",
            name: "Weather Dashboard",
            url: "https://weather-dashboard.com",
          },
        ],
        resources: [
          { id: "r1", name: "Beta React Docs", url: "https://react.dev" },
        ],
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
          {
            id: "p1",
            name: "Weather Dashboard",
            url: "https://weather-dashboard.com",
          },
        ],
        resources: [{ id: "r1", name: "Beta React Docs", url: "react.dev" }],
        notes: [{ id: "g1", text: "Remember that props are read-only." }],
      },
    },
  ],
  activeFolderId: "f1",
  activeCategory: "all",
  activeNoteId: "n1", // Track the selected note
  theme: "light",
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
      state.activeFolderId = newFolder.id;
      state.activeNoteId = null;
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
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter((f) => f.id !== action.payload);
      state.notes = state.notes.filter((n) => n.folderId !== action.payload);
      if (state.activeFolderId === action.payload) {
        state.activeFolderId = null;
        state.activeNoteId = null;
      }
    },
    renameFolder: (state, action) => {
      const folder = state.folders.find((f) => f.id === action.payload.id);
      if (folder) folder.name = action.payload.name;
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter((n) => n.id !== action.payload);
      if (state.activeNoteId === action.payload) state.activeNoteId = null;
    },
    renameNote: (state, action) => {
      const note = state.notes.find((n) => n.id === action.payload.id);
      if (note) note.title = action.payload.name;
    },
    addContentToNote: (state, action) => {
      const { folderId, noteId, category, data } = action.payload;

      // 1. Find the folder
      const folder = state.folders.find((f) => f.id === folderId);
      if (!folder) return;

      // 2. Find the note within that folder
      const note = folder.notes.find((n) => n.id === noteId);
      if (!note) return;

      // 3. Ensure the category array exists (e.g., note.data['code snippets'])
      if (!note.data[category]) {
        note.data[category] = [];
      }

      // 4. Push the new item (the code, link, or text)
      note.data[category].push({
        ...data,
        id: Date.now(), // Unique ID for the item itself
        createdAt: new Date().toISOString(),
      });
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
  deleteFolder,
  renameFolder,
  deleteNote,
  renameNote,
  addContentToNote,
} = notesSlice.actions;
export default notesSlice.reducer;
