import { useEffect, useState } from "react";
import api from "../services/api";

function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    organizationName: "",
    industry: "",
    description: "",
  });

  async function fetchOrganizations() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/organizations");
      setOrganizations(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setError(
        `Failed to load organizations. HTTP status: ${
          err.response?.status ?? "Network error"
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrganizations();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.organizationName.trim()) {
      setError("Organization name is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        organizationName: formData.organizationName.trim(),
        industry: formData.industry.trim(),
        description: formData.description.trim(),
      };

      await api.post("/organizations", payload);

      setFormData({
        organizationName: "",
        industry: "",
        description: "",
      });

      setSuccess("Organization created successfully!");
      await fetchOrganizations();
    } catch (err) {
      console.error("Error creating organization:", err);
      setError(
        err.response?.data?.message ||
          `Failed to create organization. HTTP status: ${
            err.response?.status ?? "Network error"
          }`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Organizations</h1>
        <p className="mt-2 text-slate-500">
          Manage organizations participating in ESG reporting.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Add Organization
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="organizationName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Organization Name *
            </label>
            <input
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="e.g. GreenTech Solutions"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="industry"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g. Information Technology"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter organization description"
              rows="4"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "+ Add Organization"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Organization List
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Total organizations: {organizations.length}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrganizations}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading organizations...
          </p>
        ) : organizations.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No organizations found. Add your first organization above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Organization Name</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizations.map((organization) => (
                  <tr key={organization.id}>
                    <td className="px-6 py-4">{organization.id}</td>
                    <td className="px-6 py-4 font-medium">
                      {organization.organizationName || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {organization.industry || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {organization.description || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Organizations;