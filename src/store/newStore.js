import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../service/supabase";

// --- ASYNC ACTIONS (Folders) ---

export const fetchFolders = createAsyncThunk("notes/fetchFolders", async () => {
  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
});

export const addFolder = createAsyncThunk("notes/addFolder", async (name) => {
  const { data, error } = await supabase
    .from("folders")
    .insert([{ name }])
    .select()
    .single();
  if (error) throw error;
  return data;
});

export const deleteFolder = createAsyncThunk(
  "notes/deleteFolder",
  async (id) => {
    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (error) throw error;
    return id;
  },
);

export const renameFolder = createAsyncThunk(
  "notes/renameFolder",
  async ({ id, name }) => {
    const { data, error } = await supabase
      .from("folders")
      .update({ name })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
);

// --- ASYNC ACTIONS (Notes) ---

export const fetchNotes = createAsyncThunk("notes/fetchNotes", async () => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
});

export const addNote = createAsyncThunk(
  "notes/addNote",
  async ({ title, folderId }) => {
    const newNote = {
      title,
      folder_id: folderId || null,
      data: {
        "code snippets": [],
        "side projects": [],
        resources: [],
        notes: [],
      },
    };
    const { data, error } = await supabase
      .from("notes")
      .insert([newNote])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
);

export const updateNoteContent = createAsyncThunk(
  "notes/updateNoteContent",
  async ({ id, data }) => {
    const { data: updatedNote, error } = await supabase
      .from("notes")
      .update({ data })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return updatedNote;
  },
);

export const moveNoteToFolder = createAsyncThunk(
  "notes/moveNote",
  async ({ noteId, folderId }) => {
    const { data, error } = await supabase
      .from("notes")
      .update({ folder_id: folderId })
      .eq("id", noteId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
);

export const renameNote = createAsyncThunk(
  "notes/renameNote",
  async ({ id, title }) => {
    const { data, error } = await supabase
      .from("notes")
      .update({ title })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
);

export const deleteNote = createAsyncThunk("notes/deleteNote", async (id) => {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  return id;
});

// --- SLICE ---

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    folders: [],
    notes: [],
    activeFolderId: null,
    activeNoteId: null,
    activeCategory: "all",
    activeDrawer: null, // "folders" or "notes" for mobile view
    theme: "dark",
    loading: false,
    error: null,
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
  extraReducers: (builder) => {
    builder
      // Fetching
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.folders = action.payload;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })

      // Folder Logic
      .addCase(addFolder.fulfilled, (state, action) => {
        state.folders.push(action.payload);
        state.activeFolderId = action.payload.id;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter((f) => f.id !== action.payload);
        state.notes = state.notes.filter((n) => n.folder_id !== action.payload);
      })
      .addCase(renameFolder.fulfilled, (state, action) => {
        const folder = state.folders.find((f) => f.id === action.payload.id);
        if (folder) folder.name = action.payload.name;
      })

      // Note Logic
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
        state.activeNoteId = action.payload.id;
      })
      .addCase(renameNote.fulfilled, (state, action) => {
        const note = state.notes.find((n) => n.id === action.payload.id);
        if (note) note.title = action.payload.title;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n.id !== action.payload);
        if (state.activeNoteId === action.payload) state.activeNoteId = null;
      })
      .addCase(updateNoteContent.fulfilled, (state, action) => {
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) state.notes[index] = action.payload;
      })
      .addCase(moveNoteToFolder.fulfilled, (state, action) => {
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1)
          state.notes[index].folder_id = action.payload.folder_id;
      });
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
