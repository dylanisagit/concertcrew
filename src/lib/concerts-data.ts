export interface Concert {
  id: string;
  name: string;
  date: string;
  venue: string;
  ticketStatus: string;
  review?: string;
  imageUrl?: string;
  ticketUrl?: string;
  spotifyUrl?: string;
  description?: string;
}

// Concert data from your spreadsheet
export const concertsData: Concert[] = [
  {
    id: "1",
    name: "Mt. Joy",
    date: "Saturday, September 19, 2026",
    venue: "TD Garden",
    ticketStatus: "thinking",
    description: "Indie rock band known for their heartfelt lyrics and soaring melodies."
  },
  {
    id: "2",
    name: "Hermanos Gutierrez",
    date: "Saturday, June 20, 2026",
    venue: "Xfinity Center",
    ticketStatus: "thinking",
    description: "Swiss-Ecuadorian guitar duo creating cinematic, desert-inspired instrumentals."
  },
  {
    id: "3",
    name: "Bahamas",
    date: "Friday, May 15, 2026",
    venue: "Paradise",
    ticketStatus: "pending",
    description: "Canadian singer-songwriter Afie Jurvanen's mellow folk-pop project."
  },
  {
    id: "4",
    name: "St. Paul & The Broken Bones",
    date: "Sunday, April 26, 2026",
    venue: "House of Blues",
    ticketStatus: "thinking",
    description: "Birmingham soul band with powerful vocals and horn-driven arrangements."
  },
  {
    id: "5",
    name: "The Nude Party",
    date: "Thursday, April 23, 2026",
    venue: "Brighton Music Hall",
    ticketStatus: "thinking",
    description: "Garage rock band with retro vibes and raw energy."
  },
  {
    id: "6",
    name: "Goldford",
    date: "Wednesday, April 15, 2026",
    venue: "Sinclair",
    ticketStatus: "thinking",
    description: "Electronic producer blending ambient textures with emotional songwriting."
  },
  {
    id: "7",
    name: "Mindchatter",
    date: "Thursday, March 19, 2026",
    venue: "Roadrunner",
    ticketStatus: "thinking",
    description: "Brooklyn-based electronic artist with hypnotic, danceable productions."
  },
  {
    id: "8",
    name: "Yellow Days",
    date: "Thursday, March 19, 2026",
    venue: "Brighton Music Hall",
    ticketStatus: "thinking",
    description: "British bedroom pop artist with psychedelic soul influences."
  },
  {
    id: "9",
    name: "Goldie Boutilier",
    date: "Sunday, March 8, 2026",
    venue: "Brighton Music Hall",
    ticketStatus: "thinking",
    description: "Emerging indie artist with dreamy, atmospheric soundscapes."
  },
  {
    id: "10",
    name: "RIO KOSTA",
    date: "Sunday, February 22, 2026",
    venue: "Middle East, Cambridge",
    ticketStatus: "thinking",
    description: "Dynamic performer blending multiple genres and influences."
  },
  {
    id: "11",
    name: "Say She She",
    date: "Saturday, February 21, 2026",
    venue: "The Sinclair",
    ticketStatus: "thinking",
    description: "NYC disco-funk trio with silky harmonies and groovy basslines."
  },
  {
    id: "12",
    name: "Franc Moody",
    date: "Saturday, February 21, 2026",
    venue: "Paradise",
    ticketStatus: "thinking",
    description: "London disco-funk duo known for infectious dance tracks."
  },
  {
    id: "13",
    name: "Michael Nau",
    date: "Saturday, January 31, 2026",
    venue: "Deep Cuts, Medford",
    ticketStatus: "thinking",
    description: "Folk songwriter with warm, nostalgic Americana sound."
  },
  {
    id: "14",
    name: "Curtis Harding",
    date: "Saturday, January 24, 2026",
    venue: "Brighton Music Hall",
    ticketStatus: "thinking",
    description: "Soul singer blending vintage R&B with psychedelic rock."
  },
  {
    id: "15",
    name: "Rebirth Brass Band",
    date: "Wednesday, January 21, 2026",
    venue: "Jimmy's Jazz Club, Portsmouth",
    ticketStatus: "thinking",
    description: "New Orleans brass band pioneers with Grammy-winning funk."
  },
  {
    id: "16",
    name: "GA-20",
    date: "Friday, January 16, 2026",
    venue: "The Main Pub, Manchester CT",
    ticketStatus: "thinking",
    description: "Blues trio keeping vintage electric blues alive and raw."
  },
  {
    id: "17",
    name: "Felice Brothers",
    date: "Sunday, December 28, 2025",
    venue: "Sinclair",
    ticketStatus: "pending",
    description: "Upstate NY folk-rock band with poetic, Americana storytelling."
  },
  {
    id: "18",
    name: "John Oliver",
    date: "Saturday, December 27, 2025",
    venue: "MGM Music Hall",
    ticketStatus: "thinking",
    description: "Emmy-winning comedian and host of Last Week Tonight."
  },
  {
    id: "19",
    name: "Moon Hooch",
    date: "Friday, December 12, 2025",
    venue: "Paradise",
    ticketStatus: "thinking",
    description: "Cave music duo with saxophones creating high-energy dance music."
  },
  {
    id: "20",
    name: "The Heavy Heavy",
    date: "Wednesday, December 10, 2025",
    venue: "Brighton Music Hall",
    ticketStatus: "thinking",
    description: "British duo channeling 60s psychedelia and folk-rock."
  }
];

export const getUpcomingConcerts = () => {
  const now = new Date();
  return concertsData.filter(concert => {
    const concertDate = new Date(concert.date);
    return concertDate >= now;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getPastConcerts = () => {
  const now = new Date();
  return concertsData.filter(concert => {
    const concertDate = new Date(concert.date);
    return concertDate < now;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
