import { supabase } from "./supabase";

export async function getFolders(userId) {
  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addFolder({ name, userId }) {
  const { data, error } = await supabase
    .from("folders")
    .insert([{ name, user_id: userId }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFolder(id) {
  const { error } = await supabase.from("folders").delete().eq("id", id);
  if (error) throw error;
  return id;
}

export async function renameFolder({ id, name }) {
  const { data, error } = await supabase
    .from("folders")
    .update({ name })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
