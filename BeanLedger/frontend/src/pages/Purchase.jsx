import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function Purchase() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadMember();
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

  const recordPurchase = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid purchase amount.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/api/members/${id}/purchases`,
        {
          amount: Number(amount),
        }
      );

      setMember({
        ...member,
        current_points: response.data.current_points,
        lifetime_points: response.data.lifetime_points,
        tier: response.data.tier,
      });

      setSuccess(
        `Purchase recorded successfully! +${response.data.points_earned} points earned.`
      );

      setAmount("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to record purchase."
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
              Record Purchase
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

      <main className="mx-auto max-w-xl px-6 py-12">

        {member && (
          <>
            <div className="mb-8">

              <p className="text-sm text-slate-500">
                Member
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {member.name}
              </h2>

              <div className="mt-3 flex gap-3">

                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
                  {member.tier}
                </span>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                  {member.current_points} points
                </span>

              </div>

            </div>

            <form
              onSubmit={recordPurchase}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-7"
            >

              <h3 className="text-xl font-bold">
                Record Purchase
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter the purchase amount. Points are calculated
                automatically according to the member's tier.
              </p>

              {error && (
                <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {success}
                </div>
              )}

              <label className="mt-6 block text-sm text-slate-300">
                Purchase Amount
              </label>

              <div className="relative mt-2">

                <span className="absolute left-4 top-3 text-slate-400">
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  placeholder="500"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-9 pr-4 outline-none focus:border-amber-500"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-amber-500 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
              >
                {loading
                  ? "Recording..."
                  : "Record Purchase"}
              </button>

            </form>
          </>
        )}

      </main>
    </div>
  );
}

export default Purchase;