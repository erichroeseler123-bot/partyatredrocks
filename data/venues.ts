export type Venue = {
  slug: string;
  name: string;
  city: string;
  state: string;
  capacity?: number;
  seatgeekVenueId?: number | null;
};

export const venues: Record<string, Venue> = {
  "red-rocks-amphitheatre": {
    slug: "red-rocks-amphitheatre",
    name: "Red Rocks Amphitheatre",
    city: "Morrison",
    state: "CO",
    capacity: 9525,
    seatgeekVenueId: 4208,
  },
  "mission-ballroom": {
    slug: "mission-ballroom",
    name: "Mission Ballroom",
    city: "Denver",
    state: "CO",
    capacity: 3950,
    seatgeekVenueId: 575850,
  },
  "ogden-theatre": {
    slug: "ogden-theatre",
    name: "Ogden Theatre",
    city: "Denver",
    state: "CO",
    capacity: 1600,
    seatgeekVenueId: 293,
  },
  "fillmore-auditorium-denver": {
    slug: "fillmore-auditorium-denver",
    name: "Fillmore Auditorium",
    city: "Denver",
    state: "CO",
    capacity: 3900,
    seatgeekVenueId: 245763,
  },
  "bluebird-theater-denver": {
    slug: "bluebird-theater-denver",
    name: "Bluebird Theater",
    city: "Denver",
    state: "CO",
    capacity: 550,
    seatgeekVenueId: 120,
  },
  "gothic-theatre": {
    slug: "gothic-theatre",
    name: "Gothic Theatre",
    city: "Englewood",
    state: "CO",
    capacity: 1100,
    seatgeekVenueId: 309,
  },
  "ball-arena": {
    slug: "ball-arena",
    name: "Ball Arena",
    city: "Denver",
    state: "CO",
    capacity: 18000,
    seatgeekVenueId: 7,
  },
  "mishawaka-amphitheatre": {
    slug: "mishawaka-amphitheatre",
    name: "Mishawaka Amphitheatre",
    city: "Bellvue",
    state: "CO",
    capacity: 900,
    seatgeekVenueId: 1396,
  },
};
