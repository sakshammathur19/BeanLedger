import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="text-3xl">
              ☕
            </div>

            <div>
              <h1 className="text-xl font-bold">
                BeanLedger
              </h1>

              <p className="text-xs text-slate-500">
                Café Rewards Management
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-medium transition hover:border-amber-500 hover:text-amber-400"
          >
            Staff Login
          </button>

        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

        <div>
          <div className="mb-5 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
            Smart Café Rewards
          </div>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Every point.
            <br />
            <span className="text-amber-400">
              Exactly right.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            BeanLedger helps café staff record purchases, calculate
            rewards automatically, manage member tiers, and redeem
            rewards without losing track of points.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Get Started →
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold transition hover:border-slate-500"
            >
              Explore Features
            </button>

          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Member
              </p>

              <h3 className="text-xl font-bold">
                Rahul Sharma
              </h3>
            </div>

            <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400">
              Gold
            </span>
          </div>

          <div className="rounded-xl bg-slate-800 p-6">

            <p className="text-sm text-slate-400">
              Current Points
            </p>

            <p className="mt-2 text-5xl font-bold text-amber-400">
              980
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Lifetime points: 1,230
            </p>

          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Earn Rate
              </p>

              <p className="mt-2 text-xl font-bold">
                3 pts / ₹10
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">
                Rewards
              </p>

              <p className="mt-2 text-xl font-bold">
                4 Available
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-slate-800 bg-slate-900/40 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              Key Features
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Everything the counter needs
            </h2>

            <p className="mt-4 text-slate-400">
              Simple tools designed around accurate reward management.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <Feature
              icon="⚡"
              title="Automatic Points"
              text="Points are calculated automatically based on purchase amount and member tier."
            />

            <Feature
              icon="🏆"
              title="Tier Management"
              text="Members automatically move from Bronze to Silver and Gold based on lifetime points."
            />

            <Feature
              icon="🎁"
              title="Easy Redemption"
              text="Staff can redeem available rewards while preventing negative balances."
            />

            <Feature
              icon="🔎"
              title="Fast Search"
              text="Find members quickly using their phone number, even with a large member list."
            />

          </div>

        </div>
      </section>

      {/* Target Audience */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              Built For
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Café teams of every size
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              BeanLedger is designed for cafés that need a simple,
              reliable way to manage loyalty members at the counter.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <Audience
              title="Independent Cafés"
              text="Manage loyalty without complicated systems."
            />

            <Audience
              title="Café Chains"
              text="Keep member rewards organized as the business grows."
            />

            <Audience
              title="Counter Staff"
              text="Quickly search members and record transactions."
            />

            <Audience
              title="Loyalty Managers"
              text="Maintain accurate points and reward activity."
            />

          </div>

        </div>
      </section>

      {/* How it helps */}
      <section className="bg-slate-900/40 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            How It Helps
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Less manual calculation. More confidence.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <Help
              number="01"
              title="Record"
              text="Staff enter the purchase amount and BeanLedger calculates the correct points."
            />

            <Help
              number="02"
              title="Reward"
              text="Members can redeem rewards directly from their available balance."
            />

            <Help
              number="03"
              title="Track"
              text="Every purchase and redemption is stored as a transaction."
            />

          </div>

        </div>
      </section>

      {/* Future Features */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            Next Features
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Where BeanLedger can go next
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <Future
              title="Multiple Café Locations"
              text="Manage members and transactions across multiple branches."
            />

            <Future
              title="Analytics Dashboard"
              text="Track loyalty activity, purchases, redemptions, and customer trends."
            />

            <Future
              title="Member Notifications"
              text="Notify members about rewards, tier upgrades, and special offers."
            />

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 bg-slate-900 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">

          <h2 className="text-3xl font-bold">
            Ready to manage your café rewards?
          </h2>

          <p className="mt-4 text-slate-400">
            Start managing members and rewards with BeanLedger.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-7 rounded-lg bg-amber-500 px-7 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Staff Login →
          </button>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-slate-500">
          <p>
            © 2026 BeanLedger
          </p>

          <p>
            Café Rewards Management
          </p>
        </div>
      </footer>

    </div>
  );
}


/* Components */

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}


function Audience({ title, text }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}


function Help({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
      <span className="text-sm font-bold text-amber-400">
        {number}
      </span>

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}


function Future({ title, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-7">
      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}


/* Dashboard */

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <span className="text-3xl">
              ☕
            </span>

            <div>
              <h1 className="text-xl font-bold">
                BeanLedger
              </h1>

              <p className="text-xs text-slate-500">
                Staff Dashboard
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-red-500 hover:text-red-400"
          >
            Logout
          </button>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <h2 className="text-3xl font-bold">
          Welcome to BeanLedger
        </h2>

        <p className="mt-2 text-slate-400">
          Manage members, purchases, points and rewards.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <DashboardCard
            title="Members"
            value="Manage Members"
            text="Search and manage café loyalty members."
          />

          <DashboardCard
            title="Purchases"
            value="Record Purchase"
            text="Add purchases and automatically calculate points."
          />

          <DashboardCard
            title="Rewards"
            value="Redeem Rewards"
            text="Redeem rewards using available member points."
          />

        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h3 className="text-xl font-bold">
            Core System Ready
          </h3>

          <p className="mt-3 leading-7 text-slate-400">
            Your BeanLedger backend is connected and authenticated.
            The next step is connecting the dashboard screens to the
            member, purchase, transaction, and reward APIs.
          </p>

        </div>

      </main>
    </div>
  );
}


function DashboardCard({ title, value, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h3 className="mt-3 text-xl font-bold text-amber-400">
        {value}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}


/* App Routes */

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;