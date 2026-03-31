// store/notesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [
    // { id: "f1", name: "Frontend Tips" },
    // { id: "f2", name: "Backend Docs" },
  ],
  notes: [
    // {
    //   id: "n1",
    //   folderId: "f1",
    //   title: "React js",
    //   data: {
    //     "code snippets": [
    //       {
    //         id: "c1",
    //         label: "Counter Hook",
    //         code: "const [count, setCount] = useState(0);",
    //       },
    //       {
    //         id: "c2",
    //         label: "useEffect Cleanup",
    //         code: "return () => clearInterval(timer);",
    //       },
    //     ],
    //     "side projects": [
    //       {
    //         id: "p1",
    //         name: "Weather Dashboard",
    //         url: "https://weather-dashboard.com",
    //       },
    //     ],
    //     resources: [
    //       { id: "r1", name: "Beta React Docs", url: "https://react.dev" },
    //     ],
    //     notes: [{ id: "g1", text: "Remember that props are read-only." }],
    //   },
    // },
    // {
    //   id: "n2",
    //   folderId: "f1",
    //   title: "Tailwind Config",
    //   data: {
    //     "code snippets": [
    //       {
    //         id: "c1",
    //         label: "Counter Hook",
    //         code: "const [count, setCount] = useState(0);",
    //       },
    //       {
    //         id: "c2",
    //         label: "useEffect Cleanup",
    //         code: "return () => clearInterval(timer);",
    //       },
    //     ],
    //     "side projects": [
    //       {
    //         id: "p1",
    //         name: "Weather Dashboard",
    //         url: "https://weather-dashboard.com",
    //       },
    //     ],
    //     resources: [
    //       { id: "r1", name: "Beta React Docs", url: "https://react.dev" },
    //     ],
    //     notes: [{ id: "g1", text: "Remember that props are read-only." }],
    //   },
    // },
    // {
    //   id: "n3",
    //   folderId: "f2",
    //   title: "Node 25 Features",
    //   data: {
    //     "code snippets": [
    //       {
    //         id: "c1",
    //         label: "Counter Hook",
    //         code: "const [count, setCount] = useState(0);",
    //       },
    //       {
    //         id: "c2",
    //         label: "useEffect Cleanup",
    //         code: "return () => clearInterval(timer);",
    //       },
    //     ],
    //     "side projects": [
    //       {
    //         id: "p1",
    //         name: "Weather Dashboard",
    //         url: "https://weather-dashboard.com",
    //       },
    //     ],
    //     resources: [{ id: "r1", name: "Beta React Docs", url: "react.dev" }],
    //     notes: [{ id: "g1", text: "Remember that props are read-only." }],
    //   },
    // },
  ],
  // activeFolderId: "f1",
  activeCategory: "all",
  // activeNoteId: "n1", // Track the selected note
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
        id: action.payload.id || Date.now().toString(), // Temporary ID until Supabase
        name: action.payload.name,
      };
      state.folders.push(newFolder);
      state.activeFolderId = newFolder.id;
      state.activeNoteId = null;
    },
    addNote: (state, action) => {
      const newNote = {
        id: action.payload.id || Date.now().toString(), // Allow passing ID or generate one
        folderId: state.activeFolderId,
        title: action.payload.title,
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
      const { data } = action.payload;

      let folderId = state.activeFolderId;

      if (data.folderName) {
        folderId =
          Date.now().toString() + Math.random().toString(36).substring(2, 7); // Unique ID
        const newFolder = {
          id: folderId,
          name: data.folderName,
        };
        state.folders.push(newFolder);
        state.activeFolderId = newFolder.id;
      }

      const cat =
        state.activeCategory === "all" ? "notes" : state.activeCategory;

      if (!state.activeNoteId && data.noteTitle) {
        const newNoteId =
          Date.now().toString() + Math.random().toString(36).substring(2, 7); // Unique ID

        state.notes.push({
          id: newNoteId,
          folderId,
          title: data.noteTitle || "Untitled Note",
          data: {
            [cat]: [{ ...data, id: Date.now().toString() }],
          },
        });
        state.activeNoteId = newNoteId;
      } else if (state.activeNoteId) {
        const note = state.notes.find((n) => n.id === state.activeNoteId);

        note.data[cat] = note.data[cat] || [];

        note.data[cat].push({
          ...data,
          id: Date.now(), // Unique ID for the item itself
        });
      }
    },
    deleteContent: (state, action) => {
      const { category, id } = action.payload;

      const folder = state.folders.find((f) => f.id === state.activeFolderId);
      if (!folder) return;

      const note = state.notes.find((n) => n.id === state.activeNoteId);
      if (!note || !note.data[category]) return;

      // Filter out the item by ID
      note.data[category] = note.data[category].filter(
        (item) => item.id !== id,
      );
    },
    updateContent: (state, action) => {
      const { category, id, newData } = action.payload;

      const folder = state.folders.find((f) => f.id === state.activeFolderId);
      if (!folder) return;

      const note = state.notes.find((n) => n.id === state.activeNoteId);
      if (!note || !note.data[category]) return;

      const itemIndex = note.data[category].findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        // Merge existing item with new data and update the timestamp
        note.data[category][itemIndex] = {
          ...note.data[category][itemIndex],
          ...newData,
        };
      }
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
  deleteContent,
  updateContent,
} = notesSlice.actions;
export default notesSlice.reducer;
