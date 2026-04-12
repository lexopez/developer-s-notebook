export const getActiveContent = (currentNote, activeCategory) => {
  if (!currentNote) return [];
  if (activeCategory === "all") {
    return Object.values(currentNote.data).flat();
  }
  return currentNote.data[activeCategory] || [];
};

export const filterItems = (items, searchQuery) => {
  if (!searchQuery?.trim()) return items;

  // 1. Split the query into lowercase words and remove empty strings
  const keywords = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return items.filter((item) => {
    // 2. Identify the target string based on the category structure
    const targetString = (
      item.label ||
      item.title ||
      item.name ||
      ""
    ).toLowerCase();

    // 3. "Every" keyword must be present in the target string
    // .includes() checks if the word exists, regardless of where it is
    return keywords.every((word) => targetString.includes(word));
  });
};
