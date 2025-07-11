import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// questions marks mean optional properties
interface User {
  user_id: string;
  display_name?: string;
  avatar?: string;
  metadata?: {
    team_name?: string;
  };
}

interface Roster {
  owner_id: string;
  players?: string[];
  settings?: Record<string, number>;
}

interface TeamData {
  id: string;
  display_name?: string;
  team_name?: string;
  avatar?: string | null;
  settings?: Record<string, number>;
  players?: string[];
  last_synced: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function syncRostersHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const leagueId = process.env.LEAGUE_ID;
        if (!leagueId) {
          return res.status(400).json({ error: 'Missing league id environment variable' });
        }

        const [usersResponse, rostersResponse] = await Promise.all([
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`)
        ]);

        if (!usersResponse.ok || !rostersResponse.ok) {
          throw new Error('Failed to fetch data from Sleeper API');
        }

        const users: User[] = await usersResponse.json();
        const rosters: Roster[] = await rostersResponse.json();

        const usersById = new Map(users.map(user => [user.user_id, user])); // [user_id1, userObject1], ...
        
        const rostersData: TeamData[] = rosters.map(roster => {
            const user = usersById.get(roster.owner_id);

            return  {
                id: roster.owner_id,
                display_name: user?.display_name ?? '',
                team_name: user?.metadata?.team_name ?? '',
                avatar: user?.avatar ? `https://sleepercdn.com/avatars/${user.avatar}` : null,
                settings: roster?.settings,
                players: roster.players,
                last_synced: new Date().toISOString()
            };
        });

        const { error } = await supabase
            .from('rosters')
            .upsert(rostersData, {onConflict: 'id'});
        
        if (error) {
            console.error('Upsert error:', error);
            return res.status(500).json({ error: 'Failed to sync roster data' });
        }

        return res.status(200).json({ message: 'Rosters synced successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}