const SearchResults = ({ query, searchResults, onSelect }) => {
  if (searchResults.length === 0) {
    return (
      <div className="text-primary/70">
        {query.trim()
          ? "No matching conversations found."
          : "Type a conversation name and click Search."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {searchResults.map((conversation) => (
        <button
          key={conversation.id}
          type="button"
          onClick={() => onSelect(conversation.id)}
          className="rounded-2xl border px-4 py-3 text-left transition-colors"
        >
          <div className="font-semibold truncate">{conversation.name}</div>
        </button>
      ))}
    </div>
  );
};

export default SearchResults;
