"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface League {
  scoring_settings: Record<string, number>;
}

export default function Page() {
  const [leagueData, setLeagueData] = useState<League[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: league, error: leagueError } = await supabase.from("my_league").select();
      if (leagueError) {
        console.log("Failed to fetch league data from database", leagueError);
        return;
      }
      setLeagueData(league || []);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center px-4">
        <h1 className="mt-10 mb-6 text-4xl font-bold">UD Fantasy Football</h1>

        {leagueData.length > 0 ? (
          <div className="w-full max-w-2xl text-center">
            <div className="font-semibold text-lg mb-4">Scoring Settings</div>
              <div className = "grid grid-cols-2 gap-x-60">
                {Object.entries(leagueData[0].scoring_settings).map(([key, value]) => (
                  <div key = {key} className = "flex justify-center font-mono whitespace-nowrap">
                    {key}: {String(value)}
                  </div>
                ))}
              </div>
          </div>
        ) : (
          <p> Loading scoring settings...</p>
        )}
      </div>
    </>
  )
}
