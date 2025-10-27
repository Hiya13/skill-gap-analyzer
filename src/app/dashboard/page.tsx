"use client";

import React, { useEffect, useState } from "react";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading your dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        Failed to load user data. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name} 👋</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
        <h2 className="text-xl font-semibold mb-2">User Details</h2>
        <p>
          <span className="font-medium">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-medium">Role:</span>{" "}
          <span className="capitalize">{user.role}</span>
        </p>
      </div>
    </div>
  );
}
