import { supabase } from "./supabase";

export async function getNotes(userId) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function addNote({ title, folderId, itemData, userId }) {
  const item_data = {
    "code snippets": [],
    "side projects": [],
    resources: [],
    notes: [],
  };
  const newNote = {
    title,
    folder_id: folderId || null,
    user_id: userId,
    data: itemData ? { ...item_data, ...itemData } : item_data,
  };
  const { data, error } = await supabase
    .from("notes")
    .insert([newNote])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNoteData({ id, data }) {
  const { data: updatedNote, error } = await supabase
    .from("notes")
    .update({ data })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return updatedNote;
}

export async function updateNoteFolderId({ noteId, folderId }) {
  const { data, error } = await supabase
    .from("notes")
    .update({ folder_id: folderId })
    .eq("id", noteId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function renameNote({ id, title }) {
  const { data, error } = await supabase
    .from("notes")
    .update({ title })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote(id) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  return id;
}
