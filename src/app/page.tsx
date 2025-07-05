import { createClient } from "@supabase/supabase-js";

export default function Home() {
  const supabase = createClient(process.env.SUPABASE_PUBLIC_URL!, process.env.SUPABASE_PUBLIC_ANON_KEY!)

  return (
    <>
      <div className = "text-white background min-h-screen">
        <nav className = "fixed top-0 w-full z-50 flex justify-between px-6 py-4 shadow-md">
          <a href = "#home" className = "text-4xl font-bold"> UD Fantasy Football </a>
          <div className = "space-x-5 text-2xl">
            <a href = "#league-settings"> League Settings </a>
            <a href = "#teams"> Teams </a>
          </div>
        </nav>

        <main className = "max-w-lg mx-auto ">
          <section id="home" className="min-h-screen flex flex-col justify-center items-center">
            <div className = "text-3xl font-semibold mb-4"> Home </div>
            <figure className="text-center">
              <img src="/shaq-trophy.jpeg" alt="Shaq Trophy" className="rounded-lg shadow-lg" />
              <figcaption className="">Our season 5 winner, Shaq</figcaption>
            </figure>
          </section>

          <section id="league-settings" className="min-h-screen flex flex-col justify-center items-center text-center">
            <div className="">
              <div className="text-3xl font-semibold mb-4">League Settings</div>
              <div>Here are the settings for our fantasy league...</div>
            </div>
          </section>

          <section id="teams" className="min-h-screen flex flex-col justify-center items-center text-center">
            <div className="">
              <div className="text-3xl fom mb-4">Teams</div>
              <div>Team rosters, performance, and more coming soon...</div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
