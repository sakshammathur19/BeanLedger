import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function Rewards() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [rewards, setRewards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [memberResponse, rewardsResponse] =
        await Promise.all([
          api.get(`/api/members/${id}`),
          api.get("/api/rewards"),
        ]);

      setMember(memberResponse.data);
      setRewards(rewardsResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load rewards."
      );
    } finally {
      setLoading(false);
    }
  };

  const redeem = async (reward) => {
    setError("");
    setSuccess("");

    if (
      member.current_points <
      reward.points_required
    ) {
      setError(
        `Insufficient points. You need ${reward.points_required} points.`
      );
      return;
    }

    try {
      setRedeeming(true);

      const response = await api.post(
        `/api/members/${id}/redeem`,
        {
          reward_id: reward.id,
        }
      );

      setMember({
        ...member,
        current_points: response.data.current_points,
        lifetime_points: response.data.lifetime_points,
        tier: response.data.tier,
      });

      setSuccess(
        `${response.data.reward} redeemed successfully!`
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to redeem reward."
      );
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading rewards...
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
              Reward Redemption
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

      <main className="mx-auto max-w-5xl px-6 py-10">

        {member && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>
                <p className="text-sm text-slate-500">
                  Member
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {member.name}
                </h2>
              </div>

              <div className="text-left md:text-right">

                <p className="text-sm text-slate-400">
                  Available Points
                </p>

                <p className="mt-1 text-4xl font-bold text-amber-400">
                  {member.current_points}
                </p>

              </div>

            </div>

          </div>
        )}

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

        <div className="mt-8">

          <h3 className="text-2xl font-bold">
            Available Rewards
          </h3>

          <p className="mt-2 text-slate-400">
            Select a reward to redeem using available points.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {rewards.map((reward) => {

              const canRedeem =
                member &&
                member.current_points >=
                  reward.points_required;

              return (
                <div
                  key={reward.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <h4 className="text-xl font-bold">
                        {reward.name}
                      </h4>

                      <p className="mt-2 text-sm text-slate-400">
                        {reward.points_required} points
                      </p>
                    </div>

                    <div className="text-4xl">
                      {reward.name === "Coffee"
                        ? "☕"
                        : reward.name === "Pastry"
                        ? "🥐"
                        : reward.name === "Sandwich"
                        ? "🥪"
                        : "🧋"}
                    </div>

                  </div>

                  <button
                    onClick={() => redeem(reward)}
                    disabled={!canRedeem || redeeming}
                    className={`mt-6 w-full rounded-lg py-3 font-semibold ${
                      canRedeem
                        ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                        : "cursor-not-allowed bg-slate-800 text-slate-500"
                    }`}
                  >
                    {canRedeem
                      ? "Redeem Reward"
                      : "Not Enough Points"}
                  </button>

                </div>
              );
            })}

          </div>

        </div>

      </main>
    </div>
  );
}

export default Rewards;