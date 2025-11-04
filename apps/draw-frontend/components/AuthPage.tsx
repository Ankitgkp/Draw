"use client";
import React, { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { HTTP_BACKEND } from "../config";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Clear previous errors
    setError("");

    // Basic validation
    if (!email || !password || (!isSignin && !name)) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignin ? "/signin" : "/signup";
      const body = isSignin 
        ? { username: email, password } 
        : { username: email, password, name };

      const response = await fetch(`${HTTP_BACKEND}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error message from backend
        if (data.details && data.details.length > 0) {
          // Show Zod validation errors
          const errorMessages = data.details.map((err: any) => err.message).join(", ");
          setError(errorMessages);
        } else {
          setError(data.message || "Something went wrong");
        }
        setLoading(false);
        return;
      }

      if (isSignin) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);
        // Redirect to home page
        router.push("/");
      } else {
        // After signup, redirect to signin
        alert("Account created successfully! Please sign in.");
        router.push("/signin");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md p-8 m-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isSignin ? "Welcome Back" : "Create Account"}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!isSignin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input 
                type="text" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input 
              type="text" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full mt-6"
            size="lg"
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignin ? "Sign In" : "Sign Up"}
          </Button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            {isSignin ? "Don't have an account? " : "Already have an account? "}
            <a href={isSignin ? "/signup" : "/signin"} className="text-indigo-600 hover:text-indigo-700 font-medium">
              {isSignin ? "Sign Up" : "Sign In"}
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
