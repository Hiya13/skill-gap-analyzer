"use client";

import { useEffect, useState } from "react";

type UserData = {
  id: string;
  name: string;
  email: string;
  skills: string[] | string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [error, setError] = useState("");

  // ✅ Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } else {
      setError("No user found. Please log in again.");
    }
    setLoading(false);
  }, []);

  // 🧠 Function to analyze skills (we’ll connect AI API next)
  const handleAnalyze = async () => {
    if (!target) return alert("Please enter a company or target skills.");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSkills: Array.isArray(user?.skills)
            ? user?.skills
            : (user?.skills || "").split(","),
          target,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setAiResult(data);
    } catch (err) {
      console.error(err);
      setError("Error analyzing skills.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome, {user?.name}! 👋
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Your Existing Skills
        </h2>
        {user?.skills && (
          <div className="flex flex-wrap gap-2 mt-3">
            {(Array.isArray(user.skills)
              ? user.skills
              : user.skills.split(",")
            ).map((s: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {s.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 AI Skill Gap Analyzer */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          Skill Gap Analyzer 🎯
        </h2>

        <input
          type="text"
          placeholder="Enter company name or target role (e.g. Google, Frontend Engineer)"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 text-gray-800"
        />

        <button
          onClick={handleAnalyze}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Skill Gap"}
        </button>

        {/* 🧠 Show AI result */}
        {aiResult && (
          <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800">
            <p>
              <strong>Company/Target:</strong> {target}
            </p>
            <p className="mt-2">
              <strong>Missing Skills:</strong>{" "}
              {aiResult.missingSkills?.join(", ") || "None 🎉"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
