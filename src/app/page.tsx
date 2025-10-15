'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', skills: '' });
  const [loading, setLoading] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);

  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(`Error adding user: ${data.error}`);
  } else {
    setForm({ name: '', email: '', skills: '' });
    fetchUsers(); // refresh list
  }

  setLoading(false);
};


  return (
  <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
    <h1 className="text-4xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
      Skill Gap Analyzer <span>🧠</span>
    </h1>

    <Link href="/dashboard">
      <button className="mb-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
        Go to Dashboard
      </button>
    </Link>

    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border border-gray-200"
    >
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      <input
        type="text"
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={(e) => setForm({ ...form, skills: e.target.value })}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded w-full font-semibold hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add User'}
      </button>
    </form>

    <div className="mt-10 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">Users List</h2>
      {users.length === 0 ? (
        <p className="text-gray-600">No users yet.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">
              <strong className="text-gray-800">{u.name}</strong> —{' '}
              <span className="text-gray-700">{u.email}</span>
              <div className="text-sm text-gray-600 mt-1">{u.skills}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </main>
);

}
