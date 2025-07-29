import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Authentication context for AA‑Clothing.
 *
 * Detta enkla auth‑system lagrar användare lokalt i webbläsarens
 * localStorage. Varje användare har en e‑postadress och ett lösenord
 * (lagrat i klartext för demoändamål – ersätt med en säker hash
 * och extern databas i en riktig produktionsmiljö). Funktionerna
 * register, login och logout gör det möjligt att skapa ett konto,
 * logga in och logga ut. Den aktuella användaren exponeras via
 * `user` och persistens sker via localStorage.
 */

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Ladda aktuell användare från localStorage när komponenten mountas
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  /**
   * Registrera en ny användare.
   * Kastar ett fel om e‑posten redan finns.
   */
  const register = async (email: string, password: string) => {
    const usersJson = localStorage.getItem('users');
    const users: Array<{ email: string; password: string }> = usersJson ? JSON.parse(usersJson) : [];
    if (users.find((u) => u.email === email)) {
      throw new Error('Det finns redan ett konto med den e‑postadressen');
    }
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    // auto login after registration
    const newUser: User = { email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  /**
   * Logga in en befintlig användare.
   * Kastar ett fel om e‑posten eller lösenordet inte matchar.
   */
  const login = async (email: string, password: string) => {
    const usersJson = localStorage.getItem('users');
    const users: Array<{ email: string; password: string }> = usersJson ? JSON.parse(usersJson) : [];
    const existing = users.find((u) => u.email === email && u.password === password);
    if (!existing) {
      throw new Error('Fel e‑postadress eller lösenord');
    }
    const newUser: User = { email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  /**
   * Logga ut aktuell användare.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook för att använda auth‑kontexten.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};