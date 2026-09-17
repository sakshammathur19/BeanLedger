import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    loadMembers();
  }, [page, sort, order]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/members?page=${page}&limit=10&sort=${sort}&order=${order}`
      );

      setMembers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load members."
      );
    } finally {
      setLoading(false);
    }
  };

  const searchMember = async () => {
    if (!phone.trim()) {
      loadMembers();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/members/search?phone=${phone.trim()}`
      );

      setMembers(response.data);
      setPage(1);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to search members."
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
              Members
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Dashboard
          </button>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              Loyalty Members
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Member Management
            </h2>

            <p className="mt-2 text-slate-400">
              Search and manage your café members.
            </p>
          </div>

          <button
            onClick={() => navigate("/members/add")}
            className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400"
          >
            + Add Member
          </button>

        </div>

        {/* Search & Sorting */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">

          <div className="grid gap-4 md:grid-cols-3">

            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">
                Search by phone
              </label>

              <div className="mt-2 flex gap-3">

                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchMember();
                    }
                  }}
                  placeholder="9876543210"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-amber-500"
                />

                <button
                  onClick={searchMember}
                  className="rounded-lg bg-amber-500 px-5 font-semibold text-slate-950 hover:bg-amber-400"
                >
                  Search
                </button>

              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400">
                Sort by
              </label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none"
              >
                <option value="created_at">
                  Recently Added
                </option>

                <option value="name">
                  Name
                </option>

                <option value="current_points">
                  Current Points
                </option>

                <option value="lifetime_points">
                  Lifetime Points
                </option>

                <option value="tier">
                  Tier
                </option>
              </select>
            </div>

          </div>

          <div className="mt-4 flex gap-2">

            <button
              onClick={() => {
                setOrder("desc");
                setPage(1);
              }}
              className={`rounded-lg px-4 py-2 text-sm ${
                order === "desc"
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              Descending
            </button>

            <button
              onClick={() => {
                setOrder("asc");
                setPage(1);
              }}
              className={`rounded-lg px-4 py-2 text-sm ${
                order === "asc"
                  ? "bg-amber-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              Ascending
            </button>

          </div>

        </section>

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-slate-800 bg-slate-800/50 text-sm text-slate-400">

                <tr>
                  <th className="px-6 py-4">
                    Member
                  </th>

                  <th className="px-6 py-4">
                    Phone
                  </th>

                  <th className="px-6 py-4">
                    Tier
                  </th>

                  <th className="px-6 py-4">
                    Current Points
                  </th>

                  <th className="px-6 py-4">
                    Lifetime Points
                  </th>

                  <th className="px-6 py-4">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-slate-800/70 hover:bg-slate-800/40"
                  >

                    <td className="px-6 py-5 font-semibold">
                      {member.name}
                    </td>

                    <td className="px-6 py-5 text-slate-400">
                      {member.phone}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                        {member.tier}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-semibold text-amber-400">
                      {member.current_points}
                    </td>

                    <td className="px-6 py-5 text-slate-400">
                      {member.lifetime_points}
                    </td>

                    <td className="px-6 py-5">

                      <button
                        onClick={() =>
                          navigate(`/members/${member.id}`)
                        }
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-amber-500 hover:text-amber-400"
                      >
                        View
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {loading && (
            <div className="border-t border-slate-800 px-6 py-5 text-center text-slate-400">
              Loading members...
            </div>
          )}

          {!loading && members.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-500">
              No members found.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">

            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-30"
            >
              ← Previous
            </button>

            <span className="text-sm text-slate-400">
              Page {page}
            </span>

            <button
              disabled={members.length < 10}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-30"
            >
              Next →
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Members;