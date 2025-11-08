'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, skills } },
      });

      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("Signup failed");

      // 2️⃣ Insert user into your custom "users" table
      const skillsArray = skills.split(",").map((s) => s.trim());

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id, // use the same UID from auth
          name,
          email,
          skills: skillsArray,
        },
      ]);

      if (insertError) throw insertError;

      // 3️⃣ Automatically log in after signup
      await supabase.auth.signInWithPassword({ email, password });

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
      console.error("Signup Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Account ✨
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-400 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-400 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-400 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full border border-gray-400 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </main>
  );
}
