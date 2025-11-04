'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: showSignup ? email : undefined,
          skills: showSignup ? skills : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // if new user, show signup fields
        if (data.error?.includes('signup')) {
          setShowSignup(true);
        } else {
          alert(data.error || 'Something went wrong');
        }
      } else {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Skill Gap Analyzer 🧠
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
            required
          />

          {showSignup && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Enter your skills (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : showSignup
              ? 'Sign Up'
              : 'Continue'}
          </button>
        </form>
      </div>
    </main>
  );
}
