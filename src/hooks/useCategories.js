import { useMemo } from "react";
import { useNotes } from "./notes/useNotes";
import { useSelector } from "react-redux";

export function useCategories() {
  const { notes } = useNotes();
  const { activeNoteId } = useSelector((state) => state.notes);
  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Get unique categories from all notes to populate the dropdown
  const existingCategories = useMemo(() => {
    if (!activeNote) return [];
    const resources = activeNote?.data?.resources || [];
    const categories = resources.map((r) => r.category).filter(Boolean);
    return [...new Set(categories)]; // Remove duplicates
  }, [activeNote]);

  return { existingCategories };
}
