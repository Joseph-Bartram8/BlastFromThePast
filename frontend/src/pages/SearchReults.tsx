import { useSearch } from "@tanstack/react-router";
import { useSearchResults } from "../hooks/useSearchResults";

const SearchResults = () => {
  const { q } = useSearch({ from: "/searchResults" });
  const { results, loading, error } = useSearchResults(q || "");

  return (
    <div className="min-h-screen bg-[#212121] text-white px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-6">
        Search results for: <span className="text-blue-400">"{q}"</span>
      </h1>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p className="text-gray-400">No results found.</p>
      )}

      <ul className="space-y-6">
        {results.map((user) => (
          <li
            key={user.id}
            className="bg-[#2e2e2e] p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-4">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={`${user.display_name}'s profile`}
                  className="w-12 h-12 rounded-full object-cover border border-gray-600"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                  ?
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{user.display_name}</p>
                {user.show_real_name && user.first_name && user.last_name && (
                  <p className="text-sm text-gray-400">
                    {user.first_name} {user.last_name}
                  </p>
                )}
                {user.store_name && (
                  <p className="text-sm text-gray-500">{user.store_name}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
