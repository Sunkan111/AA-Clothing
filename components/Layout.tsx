import { ReactNode } from 'react';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  /**
   * Child content to render below the header.
   */
  children: ReactNode;
  /**
   * Current search query value.
   */
  search: string;
  /**
   * Handler called when the search query is updated by the user.
   */
  onSearch: (query: string) => void;
}

/**
 * Provides a consistent layout across all pages of the site. The layout
 * includes the top navigation header and a main content area constrained
 * to a maximum width for improved readability on large screens.
 */
export default function Layout({ children, search, onSearch }: LayoutProps) {
  const { user, logout } = useAuth();
  return (
    <>
      <Header
        search={search}
        onSearch={onSearch}
        isLoggedIn={!!user}
        onLogout={logout}
      />
      <main className="max-w-7xl mx-auto px-4">{children}</main>
    </>
  );
}
