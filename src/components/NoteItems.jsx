import { ContentItem } from "./ContentItem";

export default function NoteItems({ filteredContent, activeCategory }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:pb-0 pb-10 lg:mb-0 mb-10">
      {filteredContent.map((item) => (
        <ContentItem key={item.id} item={item} category={activeCategory} />
      ))}
    </div>
  );
}
