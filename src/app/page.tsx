"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function KeyValueTable({ data } : { data: Record<string, any> }) {
  return (
    <div className = "grid grid-cols-2 gap-x-60">
      {Object.entries(data).map(([key, value]) => (
        <div key = {key} className = "flex justify-center font-mono whitespace-nowrap">
          {key}: {String(value)}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [leagueData, setLeagueData] = useState<any[]>([]);
  const [rostersData, setRostersData] = useState<any[]>([]);
  const [playersData, setPlayersData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: league, error: leagueError } = await supabase.from("my_league").select();
      const { data: rosters, error: rostersError } = await supabase.from("rosters").select();
      const { data: players, error: playersError } = await supabase.from("players").select();
      setLeagueData(league || []);
      setRostersData(rosters || []);
      setPlayersData(players || []);
      console.log(league);
      console.log(rosters);
      console.log(players);
    };
    fetchData();
  }, []);
  

  return (
    <>
      <div className = "text-white background min-h-screen">
        <nav className = "fixed top-0 w-full flex justify-between px-6 py-3 shadow-md">
          <a href = "#home" className = "text-4xl font-bold"> UD Fantasy Football </a>
          <div className = "space-x-5 text-2xl">
            <a href = "#league-settings"> League Settings </a>
            <a href = "#teams"> Teams </a>
          </div>
        </nav>

        <main className = "max-w-lg mx-auto ">
          <section id="home" className="pt-30 min-h-screen flex flex-col justify-center items-center">
            <div className = "text-3xl font-semibold mb-4"> Home </div>
            <figure className="text-center">
              <img src="/shaq-trophy.jpeg" alt="Shaq Trophy" className="rounded-lg shadow-lg" />
              <figcaption className="">Our season 5 winner, Shaq</figcaption>
            </figure>
          </section>

          <section id="league-settings" className="min-h-screen flex flex-col justify-center items-center text-center">
            <div className="">
              <div className="text-3xl font-semibold mb-4">League Settings</div>
              {leagueData.length > 0 ? (
                <>
                  <div className = "">
                    <div className = "font-semibold"> Roster Positions </div>
                     {leagueData[0].roster_positions.join(", ")}

                    <div className = "text-xs mt-5 space-x-50 flex flex-row space-y-5">
                      <div>
                        <div className = "font-semibold"> General Settings </div>
                        <KeyValueTable data = {leagueData[0].settings}/>
                      </div>
                      <div>
                        <div className = "font-semibold"> Scoring Settings </div>
                        <KeyValueTable data = {leagueData[0].scoring_settings}/>
                      </div>
                    </div>
                  </div>
                </>
                ) : (
                  <p>Loading league settings...</p>
              )}
            </div>
          </section>

          <section id="teams" className="min-h-screen flex flex-col justify-center items-center text-center">
            <div className="">
              <div className="text-3xl fom mb-4">Teams</div>
              {rostersData.length > 0 ? (
                <div> </div>
              ) : (
                <p>Loading team data...</p>
              )}
            </div>
          </section>
        </main>

        <footer className = "bottom-0 flex justify-center px-6 py-3"> 
          <a href = "https://github.com/ahmedalaminn/UD-Fantasy-Football" target="_blank" rel="noopener noreferrer"> 
            <img src = "/github.svg" alt = "GitHub" className = "w-10 h-10" />
          </a> 
        </footer>
      </div>
    </>
  );
}
