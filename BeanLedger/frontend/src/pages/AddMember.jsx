import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AddMember() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter member name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter phone number.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/members",
        {
          name: name.trim(),
          phone: phone.trim(),
        }
      );

      navigate(`/members/${response.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to create member."
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
              Add Member
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

      <main className="mx-auto max-w-xl px-6 py-12">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            New Member
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Add Café Member
          </h2>

          <p className="mt-2 text-slate-400">
            Create a new loyalty account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-7"
        >

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <label className="text-sm text-slate-300">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rahul Sharma"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-amber-500"
          />

          <label className="mt-5 block text-sm text-slate-300">
            Phone Number
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-lg bg-amber-500 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Member"}
          </button>

        </form>

      </main>
    </div>
  );
}

export default AddMember;