import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * A simple authentication context used to keep track of the currently logged
 * in user. The context exposes a user object along with login and logout
 * functions. For demonstration purposes this implementation stores the
 * session in localStorage and does not perform any backend validation.
 */
interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage when the provider mounts. This keeps the
  // authentication state persistent across page reloads.
  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  /**
   * Log a user in by storing their email in state and localStorage. In a real
   * application you would validate the credentials against an API.
   */
  const login = (email: string, _password: string) => {
    const newUser: User = { email };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  /**
   * Log the user out by clearing the local state and removing the item from
   * localStorage.
   */
  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to make it easier to access the AuthContext throughout the
 * application. Throws an error if used outside of AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
