import Link from 'next/link';

// THE COMPLETE 90+ MASTER LIST
const RED_ROCKS_SCHEDULE = [
  { date: "2026-02-07", event: "Winter on the Rocks", support: "BigXthaPlug, Smino, Mick Jenkins, PawPaw Rod" },
  { date: "2026-03-27", event: "CRANKDAT", support: "Dr. Fresch, Smoakland, Capochino, HerShe" },
  { date: "2026-03-28", event: "Ravenscoon & Jantsen", support: "Jason Leech, CHOZEN b2b Noetika, DEV" },
  { date: "2026-04-03", event: "INZO", support: "What So Not, Lumasi, Daggz, Common Creation, Spenny" },
  { date: "2026-04-04", event: "it’s murph presents Murph Rocks", support: "D.O.D, oskar med k, me n ü" },
  { date: "2026-04-10", event: "ZINGARA & LEVEL UP", support: "Saka, SubDocta, Slang Dogs" },
  { date: "2026-04-11", event: "Liquid Stranger", support: "TVBOO b2b AHEE, AVELLO" },
  { date: "2026-04-15", event: "John Mulaney: Mister Whatever", support: "Comedy Special" },
  { date: "2026-04-16", event: "bbno$", support: "Oliver Tree, Kaarija, YNG Martyr, Jungle Bobby" },
  { date: "2026-04-17", event: "Sublime", support: "Common Kings, Bumpin Uglies" },
  { date: "2026-04-18", event: "Sublime", support: "Pepper, Codefendants N2" },
  { date: "2026-04-19", event: "Wiz Khalifa", support: "2 Chainz, Berner, Underachievers, Chevy Woods" },
  { date: "2026-04-20", event: "Ice Cube", support: "Big Boi, Czarface" },
  { date: "2026-04-21", event: "Ethel Cain", support: "9Million" },
  { date: "2026-04-23", event: "Subtronics Night 1", support: "Cyclops Rocks VI" },
  { date: "2026-04-24", event: "Subtronics Night 2", support: "Cyclops Rocks VI" },
  { date: "2026-04-26", event: "Bob Moses & Cannons", support: "Special Guests" },
  { date: "2026-04-28", event: "Lewis Capaldi Night 1", support: "Joy Crookes" },
  { date: "2026-04-29", event: "Lewis Capaldi Night 2", support: "Joy Crookes" },
  { date: "2026-04-30", event: "Electric Callboy", support: "Polaris, Scene Queen" },
  { date: "2026-05-01", event: "Two Friends", support: "Planet Two Friends" },
  { date: "2026-05-02", event: "Jason Isbell", support: "Gillian Welch & David Rawlings" },
  { date: "2026-05-03", event: "Puscifer", support: "Dave Hill" },
  { date: "2026-05-06", event: "Bright Eyes", support: "21 Years of Wide Awake & Digital Ash" },
  { date: "2026-05-07", event: "Alejandro Fernández", support: "Camila Fernández" },
  { date: "2026-05-09", event: "Cloonee", support: "KETTAMA, Omar+, Cole Knight" },
  { date: "2026-05-10", event: "Hippie Sabotage", support: "Danny Brown" },
  { date: "2026-05-11", event: "YUNGBLUD", support: "IDOLS – THE WORLD TOUR" },
  { date: "2026-05-13", event: "Russell Dickerson", support: "Niko Moon" },
  { date: "2026-05-16", event: "LSDREAM Night 1", support: "DREAMROCKS II" },
  { date: "2026-05-17", event: "THE ELOVATERS", support: "Collie Buddz, Protoje, Donavon Frankenreiter" },
  { date: "2026-05-18", event: "Khalid", support: "Lauv" },
  { date: "2026-05-19", event: "Kevin Gates", support: "Shoreline Mafia, Ty Dolla $ign" },
  { date: "2026-05-21", event: "flipturn", support: "Richy Mitch & The Coal Miners" },
  { date: "2026-05-22", event: "Seven Lions", support: "Trivecta" },
  { date: "2026-05-23", event: "FISHER", support: "Residency Date" },
  { date: "2026-05-24", event: "Alabama Shakes Night 1", support: "JJ Grey & Mofro" },
  { date: "2026-05-25", event: "Alabama Shakes Night 2", support: "JJ Grey & Mofro" },
  { date: "2026-05-29", event: "Michael Franti", support: "The Original Wailers" },
  { date: "2026-05-30", event: "Alan Walker", support: "Special Guests" },
  { date: "2026-06-02", event: "Alex Warren", support: "Little Orphan Alex Live" },
  { date: "2026-06-03", event: "Yo-Yo Ma", support: "Colorado Symphony" },
  { date: "2026-06-04", event: "Brit Floyd Night 1", support: "THE WALL" },
  { date: "2026-06-05", event: "Brit Floyd Night 2", support: "DARK SIDE OF THE MOON" },
  { date: "2026-06-06", event: "Big Head Todd", support: "4 Non Blondes" },
  { date: "2026-06-10", event: "Lord Huron", support: "Special Guests" },
  { date: "2026-06-14", event: "Trevor Hall", support: "Thievery Corporation, Dirtwire" },
  { date: "2026-06-15", event: "Rod Stewart Night 1", support: "Richard Marx" },
  { date: "2026-06-16", event: "Rod Stewart Night 2", support: "Richard Marx" },
  { date: "2026-06-17", event: "Amyl and The Sniffers", support: "L7, PARTY DOZEN" },
  { date: "2026-06-18", event: "THIRD DAY", support: "Michael W. Smith" },
  { date: "2026-06-19", event: "Louis Tomlinson", support: "The Aces" },
  { date: "2026-06-20", event: "O.A.R.", support: "Gavin DeGraw, Phantom Planet" },
  { date: "2026-06-23", event: "Weird Al Yankovic", support: "Puddles Pity Party" },
  { date: "2026-07-01", event: "Treaty Oak Revival", support: "William Clark Green" },
  { date: "2026-07-02", event: "Zeds Dead Night 1", support: "DEADROCKS XII" },
  { date: "2026-07-03", event: "Zeds Dead Night 2", support: "DEADROCKS XII" },
  { date: "2026-07-10", event: "The Avett Brothers Night 1", support: "The Lemonheads" },
  { date: "2026-07-11", event: "The Avett Brothers Night 2", support: "Asleep at the Wheel" },
  { date: "2026-07-12", event: "The Avett Brothers Night 3", support: "Graham Nash" },
  { date: "2026-07-14", event: "KALEO", support: "Elle King" },
  { date: "2026-07-15", event: "The Head And The Heart Night 1", support: "Colorado Symphony" },
  { date: "2026-07-16", event: "The Head And The Heart Night 2", support: "Wilderado" },
  { date: "2026-07-17", event: "String Cheese Incident Night 1", support: "Special Guests" },
  { date: "2026-07-18", event: "String Cheese Incident Night 2", support: "Clay Street Unit" },
  { date: "2026-07-29", event: "Parker McCollum", support: "Gary Allan" },
  { date: "2026-07-30", event: "Killer Queen", support: "Tribute to Queen" },
  { date: "2026-08-08", event: "Slightly Stoopid", support: "The Movement, Pepper" },
  { date: "2026-08-13", event: "Mt. Joy Night 1", support: "Special Guests" },
  { date: "2026-08-14", event: "Mt. Joy Night 2", support: "Special Guests" },
  { date: "2026-08-17", event: "Train", support: "Barenaked Ladies, Matt Nathanson" },
  { date: "2026-08-20", event: "Tori Amos", support: "Bartees Strange" },
  { date: "2026-08-23", event: "Joe Bonamassa", support: "Special Guests" },
  { date: "2026-08-26", event: "Ray LaMontagne", support: "The Weather Station" },
  { date: "2026-09-04", event: "MANÁ Night 1", support: "Special Guests" },
  { date: "2026-09-05", event: "MANÁ Night 2", support: "Special Guests" },
  { date: "2026-09-06", event: "Gregory Alan Isakov Night 1", support: "Colorado Symphony" },
  { date: "2026-09-07", event: "Gregory Alan Isakov Night 2", support: "Colorado Symphony" },
  { date: "2026-09-08", event: "Five Finger Death Punch", support: "Cody Jinks" },
  { date: "2026-09-17", event: "Get The Led Out", support: "Zeppelin Tribute" },
  { date: "2026-10-18", event: "Matt Rife", support: "Stay Golden World Tour" },
  { date: "2026-10-23", event: "Mersiv", support: "Two Sets" },
  { date: "2026-10-26", event: "Evanescence", support: "K. Flay" },
  { date: "2026-10-29", event: "Cypress Hill & Method Man", support: "Method Man & Redman" },
  { date: "2026-11-14", event: "mike. Night 1", support: "DJ Stevie Daniels" },
  { date: "2026-11-15", event: "mike. Night 2", support: "DJ Stevie Daniels" }
];

export default function RedRocksSchedule() {
  const groupedShows = RED_ROCKS_SCHEDULE.reduce((acc: any, show) => {
    const monthYear = new Date(show.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(show);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-black text-white p-12">
      <div className="mb-20 border-b border-white/5 pb-10">
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none">Red Rocks</h1>
        <p className="text-red-600 font-bold uppercase tracking-[0.4em] mt-4 italic text-xs">
          2026 Intelligence Feed // {RED_ROCKS_SCHEDULE.length} Events Active
        </p>
      </div>

      <div className="space-y-32">
        {Object.entries(groupedShows).map(([month, shows]: [string, any]) => (
          <section key={month}>
            <h2 className="text-red-600 font-black uppercase text-xs mb-10 tracking-[0.5em] italic border-l-4 border-red-600 pl-6 shadow-red-600/20 shadow-2xl">
              {month}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shows.map((show: any, i: number) => (
                <Link key={i} href={`/shows/${show.event.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')}`} 
                      className="group bg-zinc-900/40 p-8 rounded-[3rem] border border-white/5 hover:border-yellow-400 transition-all shadow-xl hover:shadow-red-900/10">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-4 tracking-widest">{new Date(show.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <h3 className="text-2xl font-black italic uppercase group-hover:text-yellow-400 transition-colors mb-4">{show.event}</h3>
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest truncate">{show.support}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
