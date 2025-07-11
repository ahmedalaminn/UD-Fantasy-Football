"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Roster {
  id: string;
  display_name: string;
  team_name: string;
  settings: Record<string, number>;
  players: string[];
  avatar: string;
}

interface Player {
  id: string;
  full_name: string;
  team: string;
  fantasy_positions: string[];
  is_defense: boolean;
  headshot_url: string;
}

export default function Page() {
  const [rostersData, setRostersData] = useState<Roster[]>([]);
  const [playersMap, setPlayersMap] = useState<Record<string, Player>>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: rosters, error: rostersError } = await supabase.from("rosters").select();
      if (rostersError) {
        console.log("Failed to fetch rosters data from database", rostersError);
        return;
      }
      setRostersData(rosters || []);

      let allPlayerIds: string[] = [];
      for (const roster of rosters) {
        if (roster.players) {
          allPlayerIds = allPlayerIds.concat(roster.players); // merges player id arrays from each roster
        }
      }

      const { data: players, error: playersError} = await supabase.from("players").select().in("id", allPlayerIds);
      if (playersError) {
        console.log("Failed to fetch players data from database", playersError);
        return;
      }

      const map: Record<string, Player> = {};
      if (players) {
        for (const player of players) {
          map[player.id] = player;
        }
      }
      setPlayersMap(map);
    };
    fetchData();
  }, []);
  
  return (
    <>
      <div className="min-h-screen flex flex-col items-center px-4">
        <h1 className="mt-10 mb-6 text-4xl font-bold">UD Fantasy Football</h1>

        {rostersData.length > 0 ? (
          <div className = "grid grid-cols-2 gap-10">
            {rostersData.map((roster) => (
              <div key = {roster.id} className = "border p-4 max-w-3xl">
                <p className = "font-bold text-center"> Display Name: {roster.display_name} </p>
                <p className = "text-center"> Team Name: {roster.team_name || "N/A"} </p>
                {roster.avatar ? (
                  <img
                    src={roster.avatar}
                    alt={`${roster.display_name} avatar`}
                    className="mx-auto max-w-[25%] h-auto rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="mx-auto max-w-[25%] aspect-square bg-gray-300 rounded-full flex items-center justify-center mb-4 text-gray-600 text-sm select-none">
                    No Avatar
                  </div>
                )}
            
                <div>
                  <div className = "grid grid-cols-2 gap-6">
                    {roster.players.map((player_id: string) => {
                      const player = playersMap[String(player_id)];
                      if (!player) return <p key = {player_id}> Player Not Found </p>

                      return (
                        <div key = {player_id} className = "flex flex-col">
                          {!player.is_defense ? (
                            <>
                              <p className = "font-bold text-sm text-center"> Name: {player.full_name} </p>
                              <p className = "text-xs text-gray text-center"> Team Name: {player.team || "Free Agent"} </p>
                              <p className = "text-xs text-gray text-center"> Position: {player.fantasy_positions.join(", ")} </p>
                              {player.headshot_url ? (
                                <img
                                  src={player.headshot_url}
                                  alt={`${player.full_name} headshot`}
                                  className="mx-auto max-w-[30%] h-auto rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="mx-auto max-w-[30%] aspect-square bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs select-none flex-shrink-0">
                                  No Headshot
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                             <p className = "font-bold text-sm text-center"> DEFENSE </p>
                             <p className = "text-xs text-gray text-center"> Team Name: {player.team || "Free Agent"} </p>
                              <img
                                src={`https://a.espncdn.com/i/teamlogos/nfl/500/${player.team}.png`}
                                alt={`${player.full_name} headshot`}
                                className="mx-auto max-w-[30%] h-auto rounded-full object-cover flex-shrink-0"
                              />
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <p> Loading rosters... </p>
        )
        }
      </div>
	  </>
  )
}