"use client";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { usePollContext } from "../lib/pollContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { user, login } = usePollContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    if (!password) {
      setMessage("Please enter your password.");
      return;
    }
    login(email);
    router.push("/polls");
  };

  if (user) {
    router.push("/polls");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <h2 className="text-2xl font-bold mb-2 text-blue-700">{mode === "login" ? "Sign In" : "Register"}</h2>
          <p className="text-gray-500 text-sm">Welcome to Pooling App! Please {mode === "login" ? "login" : "register"} to continue.</p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-2 focus:outline-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded px-3 py-2 focus:outline-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white rounded px-4 py-2 font-semibold">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
          {message && <div className="mt-2 text-red-500 text-sm">{message}</div>}
          <div className="mt-4 text-center text-sm text-gray-500">
            {mode === "login" ? (
              <>
                Don't have an account?{' '}
                <button className="text-blue-600 underline" onClick={() => setMode("register")}>Register</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button className="text-blue-600 underline" onClick={() => setMode("login")}>Login</button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
