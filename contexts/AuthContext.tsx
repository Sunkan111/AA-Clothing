import React, { createContext, useContext, useEffect, useState } from 'react';
// Import Firebase authentication utilities and our initialized client
import { auth } from '../firebaseClient';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

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
  /**
   * The Firebase UID of the authenticated user
   */
  uid: string;
  /**
   * The email address associated with the account. May be null if none.
   */
  email: string | null;
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

  // Prenumerera på Firebase-authstatus när komponenten mountas
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  /**
   * Registrera en ny användare via Firebase Authentication. Eventuella fel
   * översätts till svenska meddelanden.
   */
  const register = async (email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
    } catch (err: any) {
      let message = 'Ett fel inträffade vid registrering';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Det finns redan ett konto med den e‑postadressen';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Ogiltig e‑postadress';
      } else if (err.code === 'auth/weak-password') {
        message = 'Lösenordet är för svagt';
      }
      throw new Error(message);
    }
  };

  /**
   * Logga in en befintlig användare via Firebase Authentication.
   */
  const login = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
    } catch (err: any) {
      let message = 'Fel e‑postadress eller lösenord';
      if (err.code === 'auth/user-not-found') {
        message = 'Ingen användare hittades med den e‑postadressen';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Fel lösenord';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Ogiltig e‑postadress';
      }
      throw new Error(message);
    }
  };

  /**
   * Logga ut aktuell användare via Firebase Authentication.
   */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
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