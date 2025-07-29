import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

/**
 * Register page for AA‑Clothing.
 *
 * Här kan användare skapa ett nytt konto genom att ange sin e‑postadress
 * och ett lösenord. Formuläret validerar att lösenordet och
 * bekräftelsen matchar. Efter registrering omdirigeras användaren
 * till inloggningssidan.
 */
export default function Register() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }
    try {
      await registerUser(email, password);
      setError(null);
      alert('Konto skapat! Du kan nu logga in.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Misslyckades att skapa konto');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Skapa konto</h1>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Bekräfta lösenord</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
        >
          Skapa konto
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Har du redan ett konto?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Logga in
        </Link>
      </p>
    </div>
  );
}