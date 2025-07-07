"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
// import { RostersTable } from "../components/RostersTable";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Page() {
  const [rostersData, setRostersData] = useState<any[]>([]);
  const [playersData, setPlayersData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: rosters, error: rostersError } = await supabase.from("rosters").select();
			const { data: players, error: playersError } = await supabase.from("players").select();
      setRostersData(rosters || []);
      setPlayersData(players || []);
    };

    fetchData();
  }, []);
  
  return (
    <>
      <div>
      </div>
	  </>
  )
}