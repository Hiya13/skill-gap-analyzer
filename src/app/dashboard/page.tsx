"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [targetSkills, setTargetSkills] = useState("");
  const [result, setResult] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCharts, setUserCharts] = useState<{ [key: string]: any }>({}); // 🟩 store chart per user

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Analyze generic input (main top analyzer)
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

  // 🔹 Analyze per-user
  const handleUserAnalyze = async (user: any) => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetSkills: targetSkills
            ? targetSkills.split(",").map((s) => s.trim())
            : [],
        }),
      });
      const data = await res.json();
      setUserCharts((prev) => ({
        ...prev,
        [user.name]: data,
      }));
    } catch (error) {
      console.error("Error analyzing skills:", error);
    }
  };

  // Chart data for top analyzer
  const chartData =
    result && result.missingSkills
      ? [
          { name: "Existing Skills", value: result.existingSkills.length },
          { name: "Missing Skills", value: result.missingSkills.length },
        ]
      : [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Skill Gap Analyzer 📊
      </h1>

      {/* 🔹 Skill Analyzer Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg mb-10">
        <label className="block text-gray-800 mb-2 font-semibold">
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
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-300 text-gray-800">
            <p>
              <strong>User:</strong> {result.user}
            </p>
            <p>
              <strong>Existing Skills:</strong>{" "}
              {result.existingSkills.join(", ")}
            </p>
            <p>
              <strong>Missing Skills:</strong>{" "}
              {result.missingSkills.join(", ")}
            </p>

            {/* 🔹 Top analyzer chart */}
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 User List Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">All Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-600">No users yet.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((u) => (
              <li
                key={u.id}
                className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800"
              >
                <strong>{u.name}</strong> — {u.email}
                <div className="mt-1 text-sm text-gray-700">
                  {(
                    Array.isArray(u.skills)
                      ? u.skills
                      : typeof u.skills === "string"
                      ? u.skills.split(",")
                      : []
                  ).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-2 mt-1"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                {/* 🔹 Analyze button per user */}
                <button
                  onClick={() => handleUserAnalyze(u)}
                  className="mt-3 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                >
                  View Skill Gap
                </button>

                {/* 🔹 User-specific chart */}
                {userCharts[u.name] && (
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart
                        data={[
                          {
                            name: "Existing Skills",
                            value:
                              userCharts[u.name].existingSkills.length || 0,
                          },
                          {
                            name: "Missing Skills",
                            value:
                              userCharts[u.name].missingSkills.length || 0,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
