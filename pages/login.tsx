import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

/**
 * Login page for AA‑Clothing.
 *
 * This page prompts the user for an e‑postadress och lösenord. När formuläret
 * skickas anropas login‑funktionen i AuthContext. Om inloggningen lyckas
 * omdirigeras användaren till startsidan. Om användaren redan är
 * inloggad visas ett meddelande istället för formuläret.
 */
export default function Login() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setError(null);
      router.push('/');
    } catch (err: any) {
      // Login throws an Error when credentials are invalid
      setError(err.message || 'Fel e‑postadress eller lösenord');
    }
  };

  if (user) {
    return (
      <div className="max-w-sm mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Du är redan inloggad</h1>
        <p className="text-gray-600">Du kan fortsätta handla eller logga ut från menyn.</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Logga in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700">E‑postadress</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
        >
          Logga in
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Har du inget konto?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Skapa konto
        </Link>
      </p>
    </div>
  );
}