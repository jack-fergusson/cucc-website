// Shared meeting details and links used throughout the public site.
const club = {
  meeting: {
    day: 'Thursdays', time: '6:00–9:00 PM', building: 'Jeffrey Hall', room: '115',
    weekday: 4, startHour: 18, endHour: 21, timeZone: 'America/Toronto',
    location: 'Jeffrey Hall, room 115',
    maps: 'https://www.google.com/maps/search/?api=1&query=Jeffrey+Hall+Queen%27s+University+Kingston',
  },
  discord: 'https://discord.gg/6dJQr4jbY3',
  instagram: 'https://www.instagram.com/queensuchess/',
  facebook: 'https://www.facebook.com/groups/130578570469174',
  email: 'queenschess@outlook.com',
};

// Past events, newest first. Original detail pages remain available as an archive.
const events = [
  { year: '2026', date: 'March 28, 2026', title: 'Queen’s Bughouse Championship', type: 'Tournament', image: 'optimized/bughouse.webp', href: '/Bughouse2026', description: 'Two players. Two boards. A whole new way to play. Our team bughouse tournament at Kingston Hall.' },
  { year: '2026', date: 'March 1, 2026', title: 'March Blitz Tournament', type: 'Tournament', image: 'optimized/stauffer.webp', href: '/BlitzMarch2026', description: 'Nine rounds of fast chess, with Open and U1500 sections at Stauffer Library.' },
  { year: '2026', date: 'January 16–18, 2026', title: 'Queen’s at CUCC 2026', type: 'Team recap', image: 'optimized/cucc-2026.webp', href: '/CUCC2026', description: 'Four Queen’s teams, a perfect 5/5, and a memorable weekend at Hart House in Toronto.' },
  { year: '2025', date: 'November 22–23, 2025', title: 'CUCC Qualifiers', type: 'Tournament', image: 'optimized/stauffer.webp', href: '/CUCCQualifiers2025', description: 'The road to the 2026 Canadian University Chess Championship began here.' },
  { year: '2025', date: 'October 25, 2025', title: 'Queen’s Chess Rapid Open', type: 'Tournament', image: 'optimized/rapid-open.webp', href: '/RapidOpen2025', description: 'Five rounds of rapid chess. Explore the tournament, photos, and results.' },
  { year: '2025', date: 'March 2025', title: 'Queen’s Chess Championship', type: 'Tournament', image: 'optimized/chess.webp', href: '/QCC2025', description: 'Our annual championship brought the community together for rated competition.' },
  { year: '2025', date: 'February 8, 2025', title: 'Winter Blitz Tournament', type: 'Tournament', image: 'optimized/stauffer.webp', href: '/blitzT', description: 'A winter afternoon of quick decisions and five-minute games.' },
  { year: '2025', date: 'January 24–26, 2025', title: 'Canadian University Chess Championship', type: 'Team event', image: 'optimized/cucc-2025.webp', href: '/CUCC2025', description: 'University teams came together for a weekend of competitive chess.' },
  { year: '2024', date: 'March 2–3, 2024', title: 'Queen’s Chess Championship', type: 'Tournament', image: 'optimized/chess.webp', href: '/QCC2024', description: 'Look back at the 2024 edition of the Queen’s Chess Championship.' },
  { year: '2024', date: 'January 26–28, 2024', title: 'Canadian University Chess Championship', type: 'Team event', image: 'optimized/cucc-2024.webp', href: '/CUCC2024', description: 'The 2024 university team championship, hosted at Queen’s.' },
];
module.exports = { club, events };
