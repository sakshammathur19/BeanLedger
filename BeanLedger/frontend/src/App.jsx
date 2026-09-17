import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";



function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-xl">
              ☕
            </div>

            <div>
              <h1 className="text-xl font-bold">
                BeanLedger
              </h1>
              <p className="text-xs text-slate-400">
                Café Rewards Management
              </p>
            </div>
          </div>

          <button className="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-amber-400">
            Staff Login
          </button>

        </div>
      </nav>


      {/* Hero Section */}
      <main>

        <section className="mx-auto max-w-7xl px-6 py-24">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Left */}
            <div>

              <div className="mb-6 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
                ☕ Smart Café Rewards Platform
              </div>

              <h2 className="text-5xl font-bold leading-tight md:text-6xl">
                Every point.
                <br />

                <span className="text-amber-400">
                  Always accurate.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                BeanLedger helps café staff manage member points,
                tier-based rewards, purchases and redemptions from
                one simple counter system.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <button className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
                  Get Started
                </button>

                <button className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
                  Explore Features
                </button>

              </div>

            </div>


            {/* Dashboard Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    Member Balance
                  </p>

                  <h3 className="mt-1 text-3xl font-bold">
                    980 pts
                  </h3>
                </div>

                <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
                  Gold
                </span>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">
                    Lifetime Points
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    1,080
                  </p>
                </div>

                <div className="rounded-xl bg-slate-800 p-4">
                  <p className="text-sm text-slate-400">
                    Tier Multiplier
                  </p>
                  <p className="mt-2 text-2xl font-bold text-amber-400">
                    3×
                  </p>
                </div>

              </div>

              <div className="mt-4 rounded-xl bg-slate-800 p-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Recent Purchase
                  </span>

                  <span className="text-sm text-green-400">
                    +30 pts
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span>
                    Café Order
                  </span>

                  <span className="font-semibold">
                    ₹100
                  </span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Features */}
        <section className="border-y border-slate-800 bg-slate-900/40">

          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                Key Features
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Built for the café counter
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                Everything staff need to manage rewards quickly
                and accurately.
              </p>

            </div>


            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <Feature
                icon="⚡"
                title="Automatic Points"
                description="Points are calculated automatically based on purchase amount and member tier."
              />

              <Feature
                icon="🏆"
                title="Tier Rewards"
                description="Bronze, Silver and Gold members automatically earn at the correct rate."
              />

              <Feature
                icon="🎁"
                title="Instant Redemption"
                description="Redeem available rewards while preventing members from going below zero."
              />

              <Feature
                icon="🔎"
                title="Fast Lookup"
                description="Find members quickly using their phone number, even with a large member list."
              />

            </div>

          </div>

        </section>


        {/* Target Audience */}
        <section className="mx-auto max-w-7xl px-6 py-20">

          <div className="grid gap-12 md:grid-cols-2">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                Who is it for?
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Designed for café teams
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                BeanLedger is designed for café staff and café chains
                that need a reliable way to manage loyalty members,
                purchases, points and rewards at the counter.
              </p>
            </div>


            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

              <h3 className="text-xl font-bold">
                How BeanLedger helps
              </h3>

              <ul className="mt-5 space-y-4 text-slate-400">

                <li>✓ Removes manual point calculations</li>
                <li>✓ Keeps balances consistent after every transaction</li>
                <li>✓ Makes phone-based member lookup simple</li>
                <li>✓ Keeps a complete transaction history</li>

              </ul>

            </div>

          </div>

        </section>


        {/* Future Features */}
        <section className="border-t border-slate-800 bg-slate-900/40">

          <div className="mx-auto max-w-7xl px-6 py-20">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                What's Next
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Future possibilities
              </h2>

            </div>


            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <Future
                title="QR Member Lookup"
                description="Let customers show a QR code instead of sharing their phone number."
              />

              <Future
                title="Customer Mobile App"
                description="Give members a mobile view of their points, rewards and transaction history."
              />

              <Future
                title="Personalized Rewards"
                description="Use purchase history to offer personalized rewards and promotions."
              />

            </div>

          </div>

        </section>

      </main>


      {/* Footer */}
      <footer className="border-t border-slate-800">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 BeanLedger
          </p>

          <p>
            Smart Café Rewards Management
          </p>

        </div>

      </footer>

    </div>
  )
}


function Feature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-amber-500/40">

      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

    </div>
  )
}


function Future({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>

    </div>
  )
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;