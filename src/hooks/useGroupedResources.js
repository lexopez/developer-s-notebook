import { useMemo } from "react";
import { useNotes } from "./notes/useNotes";
import { useSelector } from "react-redux";

export function useResources() {
  const { notes } = useNotes();
  const { activeNoteId } = useSelector((state) => state.notes);

  // Logic to group resources
  const groupedResourcesItems = useMemo(() => {
    const activeNote = notes.find((n) => n.id === activeNoteId);

    const resources = activeNote?.data?.resources || [];

    // 1. Group by category
    const groups = resources.reduce((acc, resource) => {
      const cat = resource.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(resource);
      return acc;
    }, {});

    // 2. Sort the keys (Category Names) alphabetically
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        // 3. Sort resources inside each category by title
        acc[key] = groups[key].sort((a, b) => a.name.localeCompare(b.title));
        return acc;
      }, {});
  }, [activeNoteId, notes]);

  return { groupedResourcesItems };
}
