"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { usePollContext } from "../../lib/pollContext";
import Link from "next/link";

export default function PollsPage() {
  const { polls, vote, user } = usePollContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect only once we know the user is unauthenticated
    if (user === null) {
      router.replace("/auth");
    }
  }, [user, router]);
  if (user === undefined) {
    return <div className="flex justify-center items-center min-h-screen" aria-busy="true">Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <h2 className="text-2xl font-bold mb-6">Polls Dashboard</h2>
      <div className="grid gap-6 w-full max-w-2xl">
        {polls.map((poll) => (
          <Card key={poll.id} className="w-full">
            <CardHeader>
              <Link href={`/polls/${poll.id}`} className="hover:underline">
                <h3 className="text-lg font-semibold">{poll.title}</h3>
              </Link>
              <p className="text-gray-600 text-sm">{poll.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {poll.options.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between">
                    <span>{opt.text}</span>
                    <span className="text-xs text-gray-500">Votes: {opt.votes}</span>
                    <button
                      className="ml-2 bg-blue-600 text-white rounded px-2 py-1 text-xs"
                      disabled={!user}
                      onClick={() => vote(poll.id, opt.id)}
                    >
                      Vote
                    </button>
                  </div>
                ))}
              </div>
              {!user && (
                <>
                  <div className="mt-2 text-red-500 text-xs">Login to vote!</div>
                  <div className="mt-4">
                    <Link 
                      href={`/polls/${poll.id}`}
                      className="text-blue-600 hover:underline text-sm"
                      aria-label={`View details for ${poll.title}`}
                    >
                      View Poll Details
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

