import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMember();
    loadTransactions();
  }, [id]);

  const loadMember = async () => {
    try {
      const response = await api.get(
        `/api/members/${id}`
      );

      setMember(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load member."
      );
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await api.get(
        `/api/members/${id}/transactions`
      );

      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading member...
        </p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">
          {error || "Member not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-xl font-bold">
              ☕ BeanLedger
            </h1>

            <p className="text-xs text-slate-500">
              Member Details
            </p>
          </div>

          <button
            onClick={() => navigate("/members")}
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Members
          </button>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <p className="text-sm text-slate-500">
              Member
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {member.name}
            </h2>

            <p className="mt-1 text-slate-400">
              {member.phone}
            </p>
          </div>

          <span className="w-fit rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">
            {member.tier}
          </span>

        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <Stat
            title="Current Points"
            value={member.current_points}
          />

          <Stat
            title="Lifetime Points"
            value={member.lifetime_points}
          />

          <Stat
            title="Current Tier"
            value={member.tier}
          />

        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={() =>
              navigate(`/members/${id}/purchase`)
            }
            className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400"
          >
            + Record Purchase
          </button>

          <button
            onClick={() =>
              navigate(`/members/${id}/rewards`)
            }
            className="rounded-lg border border-amber-500 px-5 py-3 font-semibold text-amber-400 hover:bg-amber-500 hover:text-slate-950"
          >
            Redeem Reward
          </button>

        </div>

        {/* Transactions */}
        <section className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-6 py-5">
            <h3 className="text-xl font-bold">
              Transaction History
            </h3>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-800/50 text-sm text-slate-400">

                <tr>
                  <th className="px-6 py-4">
                    Type
                  </th>

                  <th className="px-6 py-4">
                    Description
                  </th>

                  <th className="px-6 py-4">
                    Amount
                  </th>

                  <th className="px-6 py-4">
                    Points
                  </th>

                  <th className="px-6 py-4">
                    Date
                  </th>
                </tr>

              </thead>

              <tbody>

                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t border-slate-800"
                  >

                    <td className="px-6 py-4">
                      <span
                        className={
                          transaction.type === "PURCHASE"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {transaction.description}
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {transaction.amount
                        ? `₹${transaction.amount}`
                        : "—"}
                    </td>

                    <td
                      className={`px-6 py-4 font-semibold ${
                        transaction.points >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.points >= 0
                        ? `+${transaction.points}`
                        : transaction.points}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(
                        transaction.created_at
                      ).toLocaleString()}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {transactions.length === 0 && (
            <div className="px-6 py-10 text-center text-slate-500">
              No transactions yet.
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-amber-400">
        {value}
      </p>
    </div>
  );
}

export default MemberDetails;   