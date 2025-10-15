"use client";
import { useState } from "react";

export default function Dashboard() {
  const [targetSkills, setTargetSkills] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetSkills: targetSkills.split(",").map((s) => s.trim()),
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Skill Gap Analyzer
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <label className="block text-gray-700 mb-2 font-semibold">
          Enter Target Skills:
        </label>
        <input
          type="text"
          className="w-full border border-gray-500 rounded-lg px-3 py-2 mb-4 text-gray-900 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          placeholder="e.g., React, Java, Python"
          value={targetSkills}
          onChange={(e) => setTargetSkills(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 active:bg-blue-900 transition shadow-sm"
        >
          {loading ? "Analyzing..." : "Analyze Skill Gap"}
        </button>

        {result && (
  <div className="mt-6 bg-gray-100 p-4 rounded-lg border border-gray-300">
    <p className="text-gray-900">
      <strong className="text-gray-950">User:</strong> {result.user}
    </p>
    <p className="text-gray-900">
      <strong className="text-gray-950">Existing Skills:</strong> {result.existingSkills.join(", ")}
    </p>
    <p className="text-gray-900">
      <strong className="text-gray-950">Missing Skills:</strong> {result.missingSkills.join(", ")}
    </p>
  </div>
)}

      </div>
    </div>
  );
}
