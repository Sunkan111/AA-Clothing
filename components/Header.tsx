import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

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
 * category links, a search box, login/logout controls and a cart link.
 * Tailwind classes ensure the layout is responsive and aesthetically
 * pleasing.
 */
export default function Header({ search, onSearch, isLoggedIn, onLogout }: HeaderProps) {
  const [query, setQuery] = useState(search);
  const { items } = useCart();

  // Derive total number of items in the cart
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Synchronise local query state with the prop whenever the search prop changes.
  useEffect(() => {
    if (query !== search) {
      setQuery(search);
    }
  }, [search]);

  return (
    <header className="bg-white shadow mb-4">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        {/* Site logo */}
        <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto">
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

        {/* Search and user/cart controls */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Sök..."
            className="w-full md:w-64 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Cart link with item count */}
          <Link href="/cart" className="relative text-sm text-gray-700 hover:text-black">
            <span className="mr-1">Varukorg</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full px-1">
                {itemCount}
              </span>
            )}
          </Link>

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
