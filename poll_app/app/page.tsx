"use client";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { usePollContext } from "../lib/pollContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const { user, login, logout } = usePollContext();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setIsSubmitting(true);
    login(email);
    setIsSubmitting(false);
    setShowLogin(false);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="650" cy="100" r="80" fill="#38bdf8" fillOpacity="0.2" />
          <circle cx="150" cy="500" r="120" fill="#2563eb" fillOpacity="0.15" />
          <circle cx="400" cy="300" r="200" fill="#fbbf24" fillOpacity="0.08" />
        </svg>
      </div>
      <Card className="w-full max-w-lg shadow-2xl z-10 animate-fade-in-up">
        <CardHeader>
          <div className="flex flex-col items-center">
            <Image src="/globe.svg" alt="Pooling App" width={64} height={64} className="w-16 h-16 mb-2 drop-shadow-lg animate-spin-slow" />
            <h1 className="text-4xl font-extrabold mb-2 text-blue-700 tracking-tight">Pooling App</h1>
            <p className="text-gray-700 text-lg mb-4 text-center">Create, vote, and manage polls with a beautiful, interactive experience.</p>
          </div>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="flex flex-col gap-6 items-center">
              <div className="text-xl text-blue-700 font-semibold">Welcome, {user.email}!</div>
              <div className="flex gap-4 flex-wrap justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-3 font-semibold shadow transition" onClick={() => router.push("/polls")}>View Polls</button>
                <button className="bg-green-600 hover:bg-green-700 text-white rounded px-6 py-3 font-semibold shadow transition" onClick={() => router.push("/create-poll")}>Create Poll</button>
                <button className="bg-red-600 hover:bg-red-700 text-white rounded px-6 py-3 font-semibold shadow transition" onClick={logout}>Logout</button>
              </div>
            </div>
          ) : showLogin ? (
            <form className="flex flex-col gap-4 items-center" onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border rounded px-3 py-2 focus:outline-blue-400 w-full"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (message) setMessage(""); }}
                autoFocus
                autoComplete="email"
                required
                aria-invalid={!!message}
                aria-describedby={message ? "login-error" : undefined}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-3 font-semibold w-full shadow transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              {message && (
                <div
                  id="login-error"
                  className="mt-2 text-red-500 text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  {message}
                </div>
              )}
              <button
                type="button"
                className="text-gray-500 underline mt-2"
                onClick={() => { setShowLogin(false); setEmail(""); setMessage(""); }}
              >
                Back
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-6 py-3 font-semibold w-full shadow transition" onClick={() => setShowLogin(true)}>Login</button>
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded px-6 py-3 font-semibold w-full shadow transition" onClick={() => router.push("/polls")}>View Polls</button>
              <button className="bg-green-100 hover:bg-green-200 text-green-700 rounded px-6 py-3 font-semibold w-full shadow transition" onClick={() => router.push("/create-poll")}>Create Poll</button>
            </div>
          )}
        </CardContent>
      </Card>
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
