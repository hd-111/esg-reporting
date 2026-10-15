import { useEffect, useState } from "react";
import api from "../services/api";

function ReportingPeriods() {
  const [periods, setPeriods] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    periodName: "",
    startDate: "",
    endDate: "",
    reportingBoundary: "",
    organizationId: "",
  });

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [periodResponse, organizationResponse] = await Promise.all([
        api.get("/reporting-periods"),
        api.get("/organizations"),
      ]);

      setPeriods(
        Array.isArray(periodResponse.data) ? periodResponse.data : []
      );

      setOrganizations(
        Array.isArray(organizationResponse.data)
          ? organizationResponse.data
          : []
      );
    } catch (err) {
      console.error("Error loading reporting periods:", err);

      setError(
        `Failed to load data. HTTP status: ${
          err.response?.status ?? "Network error"
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.organizationId) {
      setError("Please select an organization.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before the start date.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        periodName: formData.periodName.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        reportingBoundary: formData.reportingBoundary.trim(),
        organization: {
          id: Number(formData.organizationId),
        },
      };

      await api.post("/reporting-periods", payload);

      setFormData({
        periodName: "",
        startDate: "",
        endDate: "",
        reportingBoundary: "",
        organizationId: "",
      });

      setSuccess("Reporting period created successfully!");

      await fetchData();
    } catch (err) {
      console.error("Error creating reporting period:", err);

      setError(
        err.response?.data?.message ||
          `Failed to create reporting period. HTTP status: ${
            err.response?.status ?? "Network error"
          }`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Reporting Periods
        </h1>

        <p className="mt-2 text-slate-500">
          Define reporting periods and boundaries for each organization.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Create reporting period */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Create Reporting Period
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Period name */}
          <div>
            <label
              htmlFor="periodName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Period Name *
            </label>

            <input
              id="periodName"
              name="periodName"
              type="text"
              value={formData.periodName}
              onChange={handleChange}
              placeholder="e.g. FY 2026"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Organization */}
          <div>
            <label
              htmlFor="organizationId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Organization *
            </label>

            <select
              id="organizationId"
              name="organizationId"
              value={formData.organizationId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="">Select an organization</option>

              {organizations.map((organization) => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.organizationName}
                </option>
              ))}
            </select>

            {organizations.length === 0 && !loading && (
              <p className="mt-2 text-sm text-orange-600">
                No organizations found. Create an organization first.
              </p>
            )}
          </div>

          {/* Start and end dates */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Start Date *
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                End Date *
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || undefined}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Reporting boundary */}
          <div>
            <label
              htmlFor="reportingBoundary"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Reporting Boundary *
            </label>

            <textarea
              id="reportingBoundary"
              name="reportingBoundary"
              value={formData.reportingBoundary}
              onChange={handleChange}
              placeholder="Describe which operations and facilities are included"
              rows={3}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving || organizations.length === 0}
            className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "+ Create Reporting Period"}
          </button>
        </form>
      </section>

      {/* Reporting periods table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Reporting Period List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Total periods: {periods.length}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading reporting periods...
          </p>
        ) : periods.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No reporting periods found. Create your first reporting period above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Period Name</th>
                  <th className="px-6 py-4 font-semibold">Organization</th>
                  <th className="px-6 py-4 font-semibold">Start Date</th>
                  <th className="px-6 py-4 font-semibold">End Date</th>
                  <th className="px-6 py-4 font-semibold">
                    Reporting Boundary
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {periods.map((period) => (
                  <tr
                    key={period.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-slate-600">
                      {period.id ?? "—"}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {period.periodName ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {period.organization?.organizationName ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {period.startDate ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {period.endDate ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {period.reportingBoundary ?? "—"}
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

export default ReportingPeriods;