
const Feature = ({ icon, title, description }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl">
        {icon}
      </div>

      <h3 className="mb-2 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
};

const FutureFeature = ({ title, description }) => {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <h3 className="mb-2 text-lg font-bold text-white">
        {title}
      </h3>

      <p className="text-sm leading-6 text-slate-300">
        {description}
      </p>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-extrabold text-amber-600">
              BeanLedger
            </h1>
            <p className="text-xs text-slate-500">
              Café Rewards Management
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="#features"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 md:block"
            >
              Features
            </a>

            <a
              href="/login"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Staff Login
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">

          <div>
            <div className="mb-5 inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              Smart Café Rewards
            </div>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Every purchase.
              <span className="block text-amber-600">
                Every point. Exactly right.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              BeanLedger helps café staff manage members, purchases,
              reward points, tiers and redemptions from one simple
              counter interface.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/login"
                className="rounded-xl bg-amber-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-amber-700"
              >
                Get Started
              </a>

              <a
                href="#features"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 hover:bg-slate-100"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Member Balance
                </p>
                <h3 className="text-3xl font-extrabold">
                  1,250 pts
                </h3>
              </div>

              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
                Gold
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-xs text-slate-500">
                  Lifetime
                </p>
                <p className="mt-1 text-xl font-bold">
                  1,850
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-xs text-slate-500">
                  Current
                </p>
                <p className="mt-1 text-xl font-bold">
                  1,250
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-xs text-slate-500">
                  Tier
                </p>
                <p className="mt-1 text-xl font-bold">
                  Gold
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-900 p-5 text-white">
              <p className="text-sm text-slate-400">
                Latest Purchase
              </p>

              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold">
                  ₹500 Purchase
                </span>

                <span className="font-bold text-amber-400">
                  +150 pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="font-semibold text-amber-600">
              KEY FEATURES
            </p>

            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Everything the counter needs
            </h2>

            <p className="mt-4 text-slate-600">
              Designed for fast, accurate and simple café reward
              management.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <Feature
              icon="🎯"
              title="Accurate Points"
              description="Automatically calculates points based on purchase amount and the member's current tier."
            />

            <Feature
              icon="⭐"
              title="Tier Management"
              description="Bronze, Silver and Gold tiers are automatically updated using lifetime points."
            />

            <Feature
              icon="🎁"
              title="Easy Redemption"
              description="Staff can redeem available rewards while preventing negative point balances."
            />

            <Feature
              icon="🔎"
              title="Fast Member Search"
              description="Find members quickly using their phone number, even when the member list is large."
            />

          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">

          <div>
            <p className="font-semibold text-amber-600">
              WHO IS IT FOR?
            </p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Built for café teams
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              BeanLedger is designed for cafés that want a reliable
              rewards counter without complicated workflows.
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex gap-3">
                <span>✓</span>
                <span className="text-slate-700">
                  Café counter staff
                </span>
              </div>

              <div className="flex gap-3">
                <span>✓</span>
                <span className="text-slate-700">
                  Café managers and owners
                </span>
              </div>

              <div className="flex gap-3">
                <span>✓</span>
                <span className="text-slate-700">
                  Growing café chains
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 text-white">
            <h3 className="text-2xl font-bold">
              How BeanLedger helps
            </h3>

            <div className="mt-7 space-y-6">

              <div>
                <p className="font-bold">
                  01 — Faster counter operations
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Search a member and record purchases quickly.
                </p>
              </div>

              <div>
                <p className="font-bold">
                  02 — Fewer calculation mistakes
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Point calculations and tier changes are handled
                  by the backend.
                </p>
              </div>

              <div>
                <p className="font-bold">
                  03 — Complete transaction history
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Purchases and redemptions are recorded for every
                  member.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Future Features */}
      <section className="bg-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-10">
            <p className="font-semibold text-amber-500">
              NEXT FEATURES
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-white">
              What's coming next
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <FutureFeature
              title="Multi-Café Support"
              description="Manage rewards and members across multiple café locations from one platform."
            />

            <FutureFeature
              title="Analytics Dashboard"
              description="Track customer activity, purchases, redemptions and reward performance."
            />

            <FutureFeature
              title="Notifications"
              description="Notify members about new rewards, tier upgrades and special offers."
            />

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          © 2026 BeanLedger — Café Rewards Management System
        </div>
      </footer>

    </div>
  );
}

