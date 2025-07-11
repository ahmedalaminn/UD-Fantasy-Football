import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// ! assures typescript the values are defined at runtime
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function syncLeagueHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch(`https://api.sleeper.app/v1/league/${process.env.LEAGUE_ID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch league from Sleeper API');
        }
        const league = await response.json();

        const { error } = await supabase.from('my_league').upsert([
            {
            league_id: league.league_id,
            name: league.name,
            settings: league.settings,
            scoring_settings: league.scoring_settings,
            roster_positions: league.roster_positions,
            last_synced: new Date().toISOString()
            }
        ],
        { onConflict: 'league_id'}
    );

        if (error) {
        console.error('Upsert error:', error);
        return res.status(500).json({ error: 'Failed to sync league data' });
        }

        return res.status(200).json({ message: 'League synced successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error'});
    }
}