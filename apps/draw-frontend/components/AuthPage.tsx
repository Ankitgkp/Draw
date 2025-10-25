"use client";
import React from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md p-8 m-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isSignin ? "Welcome Back" : "Create Account"}
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input 
              type="text" 
              placeholder="Enter your email"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          <Button 
            onClick={()=>{}}
            className="w-full mt-6"
            size="lg"
          >
            {isSignin ? "Sign In" : "Sign Up"}
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
