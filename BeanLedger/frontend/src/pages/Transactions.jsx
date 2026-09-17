import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function Transactions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, [id]);

  const loadTransactions = async () => {
    try {
      const response = await api.get(
        `/api/members/${id}/transactions`
      );

      setTransactions(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-xl font-bold">
              ☕ BeanLedger
            </h1>

            <p className="text-xs text-slate-500">
              Transactions
            </p>
          </div>

          <button
            onClick={() =>
              navigate(`/members/${id}`)
            }
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Member
          </button>

        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            History
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Transaction History
          </h2>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-slate-800 bg-slate-800/50 text-sm text-slate-400">

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
                    className="border-b border-slate-800/70"
                  >

                    <td className="px-6 py-5">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.type ===
                          "PURCHASE"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {transaction.type}
                      </span>

                    </td>

                    <td className="px-6 py-5 text-slate-300">
                      {transaction.description}
                    </td>

                    <td className="px-6 py-5 text-slate-400">
                      {transaction.amount
                        ? `₹${transaction.amount}`
                        : "—"}
                    </td>

                    <td
                      className={`px-6 py-5 font-bold ${
                        transaction.points >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.points >= 0
                        ? `+${transaction.points}`
                        : transaction.points}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(
                        transaction.created_at
                      ).toLocaleString()}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {loading && (
            <div className="px-6 py-10 text-center text-slate-400">
              Loading transactions...
            </div>
          )}

          {!loading &&
            transactions.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-500">
                No transactions found.
              </div>
            )}

        </section>

      </main>
    </div>
  );
}

export default Transactions;