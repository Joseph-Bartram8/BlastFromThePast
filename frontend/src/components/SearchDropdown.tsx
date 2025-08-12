import { useSearchResults } from "../hooks/useSearchResults";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { LucideSearch } from "lucide-react";

interface SearchDropdownProps {
  placeholder?: string;
  showOnScroll?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export default function SearchDropdown({
  placeholder = "Search...",
  showOnScroll = false,
  containerClassName = "relative w-full max-w-xs",
  inputClassName = "w-full px-2 py-1 focus:outline-none text-sm",
  buttonClassName = "",
}: SearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { results } = useSearchResults(searchQuery.trim());

  const handleSelect = (name: string) => {
    navigate({ to: "/searchResults", search: { q: name } });
    setSearchQuery("");
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${containerClassName} ${showOnScroll ? "scroll-aware" : ""}`}>
      <div
        className={`flex items-center bg-white border border-gray-300 rounded-md overflow-hidden px-2 ${buttonClassName}`}
      >
        <LucideSearch className="text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={inputClassName}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              handleSelect(searchQuery.trim());
            }
          }}
        />
      </div>

      {showDropdown && searchQuery.trim() && (
        <div className="absolute top-full mt-1 bg-white shadow-lg border border-gray-200 w-full rounded-md z-50 max-h-48 overflow-auto">
          {results && results.length > 0 ? (
            results.slice(0, 3).map((user) => (
              <div
                key={user.display_name}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                onClick={() => handleSelect(user.display_name)}
              >
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="profile"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold mr-2">
                    {user.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.display_name}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500 italic">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
