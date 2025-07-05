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
  settings?: Record<string, any>;
}

interface Roster {
  owner_id: string;
  players: string[];
}

interface TeamData {
  id: string;
  display_name?: string;
  team_name?: string;
  avatar?: string;
  settings?: Record<string, any>;
  players: string[];
  last_synced: string;
}

const supabase = createClient(process.env.SUPABASE_PUBLIC_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response_users = await fetch(`https://api.sleeper.app/v1/league/${process.env.LEAGUE_ID}/users`);
        if (!response_users.ok) {
            throw new Error('Failed to fetch users from Sleeper API')
        }
        const users: User[] = await response_users.json();

        const response_rosters= await fetch(`https://api.sleeper.app/v1/league/${process.env.LEAGUE_ID}/rosters`);
        if (!response_rosters.ok) {
            throw new Error('Failed to fetch users from Sleeper API')
        }
        const rosters: Roster[] = await response_rosters.json();

        const usersById = new Map(users.map(user => [user.user_id, user])); // [user_id1, userObject1], ...

        const rostersData: TeamData[] = rosters.map(roster => {
            const user = usersById.get(roster.owner_id);
            return  {
                id: roster.owner_id,
                display_name: user?.display_name ?? '',
                team_name: user?.metadata?.team_name ?? '',
                avatar: user?.avatar ?? '',
                settings: user?.settings ?? undefined,
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
        return res.status(500).json({ error: 'Internal server error'});
    }
}