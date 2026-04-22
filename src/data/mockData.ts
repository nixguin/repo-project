// ─── Players ───────────────────────────────────────────────────────────────
export const currentPlayer = {
    id: "p1",
    username: "NovaStar",
    email: "nova@fgcu.edu",
    elo: 1423,
    role: "player",
    game: "Valorant",
    wins: 34,
    losses: 18,
    winRate: 65,
};

export const recentMatches = [
    { id: "m1", opponent: "BlazeFX", result: "Win", eloChange: +18, date: "Apr 12", map: "Ascent" },
    { id: "m2", opponent: "DustyAim", result: "Loss", eloChange: -15, date: "Apr 11", map: "Bind" },
    { id: "m3", opponent: "ColdSnap", result: "Win", eloChange: +20, date: "Apr 10", map: "Haven" },
    { id: "m4", opponent: "VoidWalker", result: "Win", eloChange: +16, date: "Apr 9", map: "Split" },
    { id: "m5", opponent: "PixelRush", result: "Loss", eloChange: -12, date: "Apr 8", map: "Pearl" },
];

export const upcomingMatches = [
    { id: "um1", opponent: "GhostTide", time: "Today 6:00 PM", game: "Valorant" },
    { id: "um2", opponent: "IronClad", time: "Apr 15 4:00 PM", game: "Valorant" },
];

// ─── Tournament Bracket (Double Elimination) ───────────────────────────────
export type MatchNode = {
    id: string;
    team1: string;
    team2: string;
    score1?: number;
    score2?: number;
    time: string;
    status: "upcoming" | "live" | "done";
    winner?: string;
};

export const winnersRound1: MatchNode[] = [
    { id: "w1m1", team1: "NovaStar", team2: "BlazeFX", score1: 13, score2: 7, time: "Apr 12 2:00 PM", status: "done", winner: "NovaStar" },
    { id: "w1m2", team1: "IronClad", team2: "GhostTide", score1: 13, score2: 10, time: "Apr 12 2:00 PM", status: "done", winner: "IronClad" },
    { id: "w1m3", team1: "ColdSnap", team2: "PixelRush", score1: 9, score2: 13, time: "Apr 12 3:00 PM", status: "done", winner: "PixelRush" },
    { id: "w1m4", team1: "VoidWalker", team2: "DustyAim", score1: 13, score2: 11, time: "Apr 12 3:00 PM", status: "done", winner: "VoidWalker" },
];

export const winnersRound2: MatchNode[] = [
    { id: "w2m1", team1: "NovaStar", team2: "IronClad", score1: 13, score2: 8, time: "Apr 13 2:00 PM", status: "done", winner: "NovaStar" },
    { id: "w2m2", team1: "PixelRush", team2: "VoidWalker", score1: undefined, score2: undefined, time: "Apr 13 4:00 PM", status: "live" },
];

export const grandFinal: MatchNode = {
    id: "gf1", team1: "NovaStar", team2: "TBD", time: "Apr 14 5:00 PM", status: "upcoming",
};

export const losersRound1: MatchNode[] = [
    { id: "l1m1", team1: "BlazeFX", team2: "GhostTide", score1: 13, score2: 6, time: "Apr 13 12:00 PM", status: "done", winner: "BlazeFX" },
    { id: "l1m2", team1: "ColdSnap", team2: "DustyAim", score1: 7, score2: 13, time: "Apr 13 12:00 PM", status: "done", winner: "DustyAim" },
];

export const losersRound2: MatchNode[] = [
    { id: "l2m1", team1: "IronClad", team2: "BlazeFX", time: "Apr 13 6:00 PM", status: "upcoming" },
    { id: "l2m2", team1: "VoidWalker", team2: "DustyAim", time: "Apr 13 6:00 PM", status: "upcoming" },
];

// ─── Sponsor Analytics ─────────────────────────────────────────────────────
export const sponsorCampaign = {
    name: "GearUp Energy – Spring 2026",
    budget: 5000,
    spent: 3240,
    reach: 48200,
    impressions: 124500,
    ctr: 3.8,
    clicks: 4731,
    engagement: 6.2,
};

export const dailyMetrics = [
    { day: "Apr 7", impressions: 9800, clicks: 340, engagement: 5.2 },
    { day: "Apr 8", impressions: 11200, clicks: 410, engagement: 5.8 },
    { day: "Apr 9", impressions: 13400, clicks: 520, engagement: 6.1 },
    { day: "Apr 10", impressions: 18700, clicks: 710, engagement: 6.9 },
    { day: "Apr 11", impressions: 22100, clicks: 870, engagement: 7.3 },
    { day: "Apr 12", impressions: 27600, clicks: 1050, engagement: 7.8 },
    { day: "Apr 13", impressions: 21700, clicks: 831, engagement: 6.2 },
];

// ─── Admin Users ───────────────────────────────────────────────────────────
export type AdminUser = {
    id: string;
    username: string;
    email: string;
    role: "player" | "organizer" | "sponsor" | "admin";
    status: "active" | "banned" | "pending";
    joined: string;
};

export const adminUsers: AdminUser[] = [
    { id: "u1", username: "NovaStar", email: "nova@fgcu.edu", role: "player", status: "active", joined: "Jan 10, 2026" },
    { id: "u2", username: "TourneyKing", email: "tk@fgcu.edu", role: "organizer", status: "active", joined: "Feb 3, 2026" },
    { id: "u3", username: "GearUpRep", email: "gearup@sponsor.com", role: "sponsor", status: "active", joined: "Mar 1, 2026" },
    { id: "u4", username: "BlazeFX", email: "blaze@fgcu.edu", role: "player", status: "banned", joined: "Jan 22, 2026" },
    { id: "u5", username: "SysAdmin", email: "admin@fgcu.edu", role: "admin", status: "active", joined: "Jan 1, 2026" },
    { id: "u6", username: "ColdSnap", email: "cold@fgcu.edu", role: "player", status: "pending", joined: "Apr 12, 2026" },
    { id: "u7", username: "DustyAim", email: "dusty@fgcu.edu", role: "player", status: "active", joined: "Feb 28, 2026" },
];

// ─── Events ────────────────────────────────────────────────────────────────
export type GameEvent = {
    id: string;
    name: string;
    game: string;
    date: string;
    registrationDeadline: string;
    status: "upcoming" | "live" | "completed";
    maxPlayers: number;
    registeredPlayers: number;
    prizePool: string;
    format: string;
    description: string;
    organizer: string;
};

export const events: GameEvent[] = [
    {
        id: "e1",
        name: "FGCU Spring Valorant Open",
        game: "Valorant",
        date: "Apr 26, 2026 · 12:00 PM",
        registrationDeadline: "Apr 24, 2026",
        status: "upcoming",
        maxPlayers: 32,
        registeredPlayers: 24,
        prizePool: "$500",
        format: "Double Elimination",
        description: "Open Valorant tournament for all FGCU students. Top 3 teams split the prize pool.",
        organizer: "TourneyKing",
    },
    {
        id: "e2",
        name: "Rocket League 2v2 Invitational",
        game: "Rocket League",
        date: "Apr 21, 2026 · 3:00 PM",
        registrationDeadline: "Apr 20, 2026",
        status: "live",
        maxPlayers: 16,
        registeredPlayers: 16,
        prizePool: "$250",
        format: "Single Elimination",
        description: "Fast-paced 2v2 Rocket League showdown. Brackets seeded by rank.",
        organizer: "TourneyKing",
    },
    {
        id: "e3",
        name: "Smash Bros Ultimate Weekly #12",
        game: "Super Smash Bros. Ultimate",
        date: "Apr 14, 2026 · 6:00 PM",
        registrationDeadline: "Apr 14, 2026",
        status: "completed",
        maxPlayers: 24,
        registeredPlayers: 24,
        prizePool: "$100",
        format: "Double Elimination",
        description: "Weekly Smash Bros local. Open to all skill levels.",
        organizer: "TourneyKing",
    },
    {
        id: "e4",
        name: "League of Legends 5v5 Clash",
        game: "League of Legends",
        date: "May 3, 2026 · 2:00 PM",
        registrationDeadline: "May 1, 2026",
        status: "upcoming",
        maxPlayers: 40,
        registeredPlayers: 10,
        prizePool: "$750",
        format: "Round Robin + Playoffs",
        description: "Team-based LoL tournament. Register a full 5-man roster.",
        organizer: "TourneyKing",
    },
    {
        id: "e5",
        name: "Overwatch 2 Campus Cup",
        game: "Overwatch 2",
        date: "May 10, 2026 · 1:00 PM",
        registrationDeadline: "May 7, 2026",
        status: "upcoming",
        maxPlayers: 24,
        registeredPlayers: 6,
        prizePool: "$300",
        format: "Group Stage + Bracket",
        description: "Inter-college Overwatch 2 Cup. Represent FGCU against other Florida schools.",
        organizer: "TourneyKing",
    },
];
