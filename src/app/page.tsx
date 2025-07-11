export default function Home() {
  return (
    <>
      {/* Main */}
      <div className = "min-h-screen flex flex-col items-center">
        <h1 className = "mt-10 mb-6 text-4xl font-bold"> UD Fantasy Football </h1>

        <figure className="max-w-lg mx-auto flex flex-col justify-center items-center text-center">
          <img 
            src="/shaq-trophy.jpeg" 
            alt="Shaq Trophy" 
            className="rounded-lg shadow-lg max-h-[700px] object-contain" 
          />
          <figcaption className="mt-2 text-m">Shaq (right), Season 5 champ, receiving the trophy from none other than the Commish!</figcaption>
        </figure>

        {/* Links to different pages here*/}
        <div className="mt-auto flex justify-center gap-4">
          <a
            href="/leagueSettings"
            className="px-6 py-2 bg-violet-600 text-white rounded-xl shadow hover:bg-violet-700 transition"
          >
            League Settings
          </a>
          <a
            href="/scoringSettings"
            className="px-6 py-2 bg-violet-600 text-white rounded-xl shadow hover:bg-violet-700 transition"
          >
            Scoring Settings
          </a>
          <a
            href="/rosters"
            className="px-6 py-2 bg-violet-600 text-white rounded-xl shadow hover:bg-violet-700 transition"
          >
            Rosters
          </a>
        </div>

        {/* GitHub Footer */}
        <div className = "mt-auto mb-6">
          <a 
            href = "https://github.com/ahmedalaminn/UD-Fantasy-Football" 
            target="_blank" 
            rel="noopener noreferrer"
          > 
            <img src = "/github.svg" alt = "GitHub" className = "size-10" />
          </a> 
        </div>
      </div>
    </>
  );
}
