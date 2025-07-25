import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  /**
   * Current search query value.
   */
  search: string;
  /**
   * Callback triggered whenever the search input changes.
   */
  onSearch: (query: string) => void;
  /**
   * Whether a user is currently logged in. Determines if login or logout
   * controls are displayed.
   */
  isLoggedIn: boolean;
  /**
   * Callback invoked when the user clicks the logout button.
   */
  onLogout: () => void;
}

/**
 * The header component renders a top navigation bar with the site logo,
 * category links, a search box and login/logout controls. Tailwind classes
 * ensure the layout is responsive and aesthetically pleasing.
 */
export default function Header({
  search,
  onSearch,
  isLoggedIn,
  onLogout,
}: HeaderProps) {
  const [query, setQuery] = useState(search);

  // Synchronise local query state with the prop whenever the search prop changes.
  // This ensures controlled updates from the parent component.
  if (query !== search) {
    setQuery(search);
  }

  return (
    <header className="bg-white shadow mb-4">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <Link href="/" className="font-bold text-xl whitespace-nowrap">
            AA Clothing
          </Link>
          <nav className="hidden md:flex space-x-4 text-gray-600 text-sm">
            <Link href="#" className="hover:text-black">
              Dam
            </Link>
            <Link href="#" className="hover:text-black">
              Herr
            </Link>
            <Link href="#" className="hover:text-black">
              Barn
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Sök..."
            className="w-full md:w-64 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="text-sm text-blue-600 hover:underline whitespace-nowrap"
            >
              Logga ut
            </button>
          ) : (
            <Link href="/login" className="text-sm text-blue-600 hover:underline whitespace-nowrap">
              Logga in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
