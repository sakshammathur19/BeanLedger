import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [members, setMembers] = useState([]);

  const [amount, setAmount] = useState("");
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadMembers();
    loadRewards();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await api.get(
        "/api/members?page=1&limit=10&sort=created_at&order=desc"
      );

      setMembers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRewards = async () => {
    try {
      const response = await api.get("/api/rewards");
      setRewards(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchMember = async () => {
    setError("");
    setMessage("");
    setMember(null);

    if (!phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/api/members/search?phone=${phone.trim()}`
      );

      if (response.data.length === 0) {
        setError("No member found with this phone number.");
        return;
      }

      setMember(response.data[0]);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to search member."
      );
    } finally {
      setLoading(false);
    }
  };

  const recordPurchase = async () => {
    setError("");
    setMessage("");

    if (!member) {
      setError("Search for a member first.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid purchase amount.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/api/members/${member.id}/purchases`,
        {
          amount: Number(amount),
        }
      );

      setMessage(
        `Purchase recorded! +${response.data.points_earned} points earned.`
      );

      setMember({
        ...member,
        current_points: response.data.current_points,
        lifetime_points: response.data.lifetime_points,
        tier: response.data.tier,
      });

      setAmount("");

      loadMembers();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to record purchase."
      );
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async () => {
    setError("");
    setMessage("");

    if (!member) {
      setError("Search for a member first.");
      return;
    }

    if (!selectedReward) {
      setError("Select a reward first.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/api/members/${member.id}/redeem`,
        {
          reward_id: Number(selectedReward),
        }
      );

      setMessage(
        `${response.data.reward} redeemed successfully!`
      );

      setMember({
        ...member,
        current_points: response.data.current_points,
        lifetime_points: response.data.lifetime_points,
        tier: response.data.tier,
      });

      setSelectedReward("");

      loadMembers();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to redeem reward."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="text-3xl">☕</div>

            <div>
              <h1 className="text-xl font-bold">
                BeanLedger
              </h1>

              <p className="text-xs text-slate-500">
                Café Rewards Counter
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-400">
            Staff Dashboard
          </div>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            Counter
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Rewards Management
          </h2>

          <p className="mt-2 text-slate-400">
            Search members, record purchases and redeem rewards.
          </p>
        </div>

        {/* Search */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-bold">
            Find Member
          </h3>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchMember();
                }
              }}
              placeholder="Enter phone number"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-amber-500"
            />

            <button
              onClick={searchMember}
              disabled={loading}
              className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search Member"}
            </button>

          </div>

        </section>

        {/* Messages */}
        {message && (
          <div className="mt-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Member Details */}
        {member && (
          <section className="mt-8">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                <div>
                  <p className="text-sm text-slate-400">
                    Member
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-slate-500">
                    {member.phone}
                  </p>
                </div>

                <span className="w-fit rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">
                  {member.tier}
                </span>

              </div>

              {/* KPIs */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <Kpi
                  title="Current Points"
                  value={member.current_points}
                />

                <Kpi
                  title="Lifetime Points"
                  value={member.lifetime_points}
                />

                <Kpi
                  title="Tier"
                  value={member.tier}
                />

              </div>

            </div>

            {/* Actions */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* Purchase */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h3 className="text-xl font-bold">
                  Record Purchase
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Enter the purchase amount. BeanLedger calculates
                  the correct points automatically.
                </p>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Purchase amount ₹"
                  className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-amber-500"
                />

                <button
                  onClick={recordPurchase}
                  disabled={loading}
                  className="mt-4 w-full rounded-lg bg-amber-500 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
                >
                  Record Purchase
                </button>

              </div>

              {/* Redemption */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <h3 className="text-xl font-bold">
                  Redeem Reward
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Current balance:{" "}
                  <span className="font-semibold text-amber-400">
                    {member.current_points} points
                  </span>
                </p>

                <select
                  value={selectedReward}
                  onChange={(e) =>
                    setSelectedReward(e.target.value)
                  }
                  className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-amber-500"
                >
                  <option value="">
                    Select a reward
                  </option>

                  {rewards.map((reward) => (
                    <option
                      key={reward.id}
                      value={reward.id}
                    >
                      {reward.name} — {reward.points_required} points
                    </option>
                  ))}
                </select>

                <button
                  onClick={redeemReward}
                  disabled={loading}
                  className="mt-4 w-full rounded-lg border border-amber-500 py-3 font-semibold text-amber-400 hover:bg-amber-500 hover:text-slate-950 disabled:opacity-50"
                >
                  Redeem Reward
                </button>

              </div>

            </div>

          </section>
        )}

        {/* Members */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                Members
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Recent loyalty members
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-slate-800 text-sm text-slate-400">
                <tr>
                  <th className="px-4 py-3">
                    Name
                  </th>

                  <th className="px-4 py-3">
                    Phone
                  </th>

                  <th className="px-4 py-3">
                    Tier
                  </th>

                  <th className="px-4 py-3">
                    Current Points
                  </th>

                  <th className="px-4 py-3">
                    Lifetime Points
                  </th>
                </tr>
              </thead>

              <tbody>

                {members.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => {
                      setMember(item);
                      setPhone(item.phone);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="cursor-pointer border-b border-slate-800/70 hover:bg-slate-800/50"
                  >

                    <td className="px-4 py-4 font-medium">
                      {item.name}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {item.phone}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                        {item.tier}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-amber-400">
                      {item.current_points}
                    </td>

                    <td className="px-4 py-4 text-slate-400">
                      {item.lifetime_points}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

            {members.length === 0 && (
              <p className="py-8 text-center text-slate-500">
                No members found.
              </p>
            )}

          </div>

        </section>

      </main>
    </div>
  );
}


function Kpi({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-800 p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-amber-400">
        {value}
      </p>

    </div>
  );
}


export default Dashboard;