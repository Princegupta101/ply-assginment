"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import NavBar from "@/Components/NavBar";

function Register() {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (data) => {
    if (!data.username) {
      enqueueSnackbar("Enter Username", { variant: "error" });
    } else if (!data.password) {
      enqueueSnackbar("Enter Password", { variant: "error" });
    } else if (!data.role) {
      enqueueSnackbar("Select Role", { variant: "error" });
    } else {
      registerUser(data);
    }
  };

  const registerUser = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/users/register", data);
      if (res.status === 200) {
        enqueueSnackbar(res.data.message, { variant: "success" });
        router.push("/login");
      }
    } catch (err) {
      setIsLoading(false);
      enqueueSnackbar(err.response.data.error, { variant: "error" });
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          {!isLoading ? (
            <>
              <div className="flex flex-col items-center justify-center mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900">Register</h1>
                <span className="text-sm text-gray-500">
                  Enter your credentials to create an account
                </span>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <input
                  {...register("username")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Username"
                />
                <input
                  {...register("password")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Password"
                  type="password"
                />
                <div className="flex justify-around">
                  <label className="flex items-center space-x-2">
                    <input
                      {...register("role")}
                      name="role"
                      className="w-4 h-4 border-gray-300 text-orange-400 focus:ring-orange-400"
                      type="radio"
                      value="admin"
                    />
                    <span className="text-gray-700">Admin</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      {...register("role")}
                      name="role"
                      className="w-4 h-4 border-gray-300 text-orange-400 focus:ring-orange-400"
                      type="radio"
                      value="team_member"
                    />
                    <span className="text-gray-700">Team Member</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-orange-400 text-white font-bold uppercase rounded-md hover:bg-orange-500 transition duration-300"
                >
                  Register
                </button>
              </form>
              <div className="flex flex-col items-center justify-center mt-4">
                <span className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <a className="text-orange-400 hover:underline" href="/login">
                    Login here
                  </a>
                </span>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-6xl text-orange-400 animate-bounce">....</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Register;
