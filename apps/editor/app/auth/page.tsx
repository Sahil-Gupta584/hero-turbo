'use client';
import { FcGoogle } from "react-icons/fc";
import { Button } from "@heroui/react";
import { login } from "@/lib/authActions";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-md p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6">
          Login as <span className="text-indigo-600 dark:text-indigo-400">Editor</span>
        </h1>

        <Button
          variant="bordered"
          className="flex items-center gap-3 px-6 py-3 text-lg font-medium text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all duration-200 ease-in-out"
          onPress={() => login()}
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </Button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Secure login powered by Google OAuth
        </p>
      </div>
    </div>
  );
}
