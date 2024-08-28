"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import NavBar from "@/Components/NavBar";

const ProfilePage = () => {
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
  });

  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem('role'));
    setUserId(localStorage.getItem('user_id'));
  }, []);

  useEffect(() => {
    if (role && userId) {
      fetchStats();
    }
  }, [role, userId]);

  const fetchStats = async () => {
    try {
      const res = role === "admin" 
        ? await axios.get("/api/stats")
        : await axios.get(`/api/stats/userStats?user_id=${userId}`);
      
      if (res.status === 200) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleClick = () => {
    router.push(role === "admin" ? "/profile/pending" : `/profile/submissions?user_id=${userId}`);
  };

  const buttonText = role === "admin" ? "Pending Requests" : "My Submissions";

  return (
    <>
      <NavBar />
      <div className="container mx-auto my-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-orange-500">Profile Stats</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-orange-500 text-white uppercase rounded-lg shadow-md hover:bg-orange-600 transition duration-300"
            >
              {buttonText}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-700 text-white uppercase rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
            <h2 className="text-lg font-semibold text-gray-700">Total Requests</h2>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
            <h2 className="text-lg font-semibold text-yellow-700">Pending Requests</h2>
            <p className="text-2xl font-bold text-yellow-900">{stats.pendingRequests}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg border-2 border-red-300">
            <h2 className="text-lg font-semibold text-red-700">Rejected Requests</h2>
            <p className="text-2xl font-bold text-red-900">{stats.rejectedRequests}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
