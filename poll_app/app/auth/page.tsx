import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { usePollContext } from "../../lib/pollContext";
import { useState } from "react";

export default function AuthPage() {
  const { user, login, logout } = usePollContext();
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    login(email);
    setMessage("");
  };

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-xl font-bold mb-2">Welcome, {user.email}!</h2>
          </CardHeader>
          <CardContent>
            <button className="bg-red-600 text-white rounded px-4 py-2" onClick={logout}>Logout</button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-bold mb-2">{mode === "login" ? "Sign In" : "Register"}</h2>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold">
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
