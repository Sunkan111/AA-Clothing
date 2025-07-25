import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

/**
 * A simple login page that prompts the user for an email and password. When
 * submitted the credentials are passed to the AuthContext which handles
 * persisting the session. After logging in the user is redirected back
 * to the home page.
 */
export default function Login() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push('/');
  };

  // If the user is already logged in show a message instead of the form.
  if (user) {
    return (
      <div className="max-w-sm mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Du är redan inloggad</h1>
        <p className="mb-4">Du kan fortsätta handla eller logga ut från menyn.</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Logga in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="E‑post"
          className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Lösenord"
          className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded text-sm hover:bg-gray-800"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}
