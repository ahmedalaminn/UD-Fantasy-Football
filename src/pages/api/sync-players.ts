import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

interface Player {
    player_id: string;
    espn_id?: number;
    full_name?: string;
    team?: string;
    fantasy_positions?: string[];
    sport?: string;
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function syncPlayersHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch("https://api.sleeper.app/v1/players/nfl")
        if (!response.ok) {
            throw new Error('Failed to fetch players from Sleeper API')
        }

        const players: Record<string, Player> = await response.json();
        const nflPlayers = Object.values(players)
            .filter(player => player.sport === 'nfl')
            .map(player => {
                return {
                    id: player.player_id,
                    espn_id: player.espn_id ?? null,
                    full_name: player.full_name ?? '',
                    team: player.team ?? null,
                    fantasy_positions: player.fantasy_positions ?? [],
                    headshot_url: player.espn_id ? `https://a.espncdn.com/i/headshots/nfl/players/full/${player.espn_id}.png` : null,
                    is_defense: player.fantasy_positions?.[0] === "DEF",
                    last_synced: new Date().toISOString()
                };
            });
        
        const { error } = await supabase.from('players').upsert(nflPlayers, {
        onConflict: 'id'
        });

        if (error) {
        console.error('Upsert error:', error);
        return res.status(500).json({ error: 'Failed to sync player data' });
        }

        return res.status(200).json({ message: 'Players synced successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error'});
    }
}
