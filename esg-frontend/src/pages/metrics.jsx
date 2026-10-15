import { useEffect, useState } from "react";
import api from "../services/api";

function Metrics() {
  const [metrics, setMetrics] = useState([]);

  const [formData, setFormData] = useState({
    metricName: "",
    pillar: "",
    description: "",
    unit: "",
    formula: "",
    dataSource: "",
    reportingBoundary: "",
    responsibleOwner: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/metric-definitions");

      setMetrics(response.data);
    } catch (err) {
      console.error("Error fetching metrics:", err);

      setError(
        "Unable to load metrics. Check your backend and API endpoint."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/metric-definitions", formData);

      setSuccess("ESG metric added successfully!");

      setFormData({
        metricName: "",
        pillar: "",
        description: "",
        unit: "",
        formula: "",
        dataSource: "",
        reportingBoundary: "",
        responsibleOwner: "",
      });

      await fetchMetrics();
    } catch (err) {
      console.error("Error saving metric:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save metric. Please check your backend."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this metric?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(`/metric-definitions/${id}`);

      setSuccess("Metric deleted successfully!");

      await fetchMetrics();
    } catch (err) {
      console.error("Error deleting metric:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete metric."
      );
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-slate-800">
          ESG Metrics
        </h1>

        <p className="mt-2 text-slate-500">
          Define and manage environmental, social, and governance metrics.
        </p>
      </header>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-green-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Environmental
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              metrics.filter(
                (metric) => metric.pillar === "Environmental"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Social
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {
              metrics.filter(
                (metric) => metric.pillar === "Social"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Governance
          </p>

          <p className="mt-2 text-3xl font-bold text-purple-600">
            {
              metrics.filter(
                (metric) => metric.pillar === "Governance"
              ).length
            }
          </p>
        </div>
      </section>

      {/* Add Metric Form */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          Add ESG Metric
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the details of the metric you want to track.
        </p>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {/* Metric Name */}
          <div>
            <label
              htmlFor="metricName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Metric Name *
            </label>

            <input
              id="metricName"
              name="metricName"
              type="text"
              value={formData.metricName}
              onChange={handleChange}
              placeholder="e.g. Carbon Emissions"
              className={inputClass}
              required
            />
          </div>

          {/* Pillar */}
          <div>
            <label
              htmlFor="pillar"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              ESG Pillar *
            </label>

            <select
              id="pillar"
              name="pillar"
              value={formData.pillar}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select pillar</option>
              <option value="Environmental">
                Environmental
              </option>
              <option value="Social">
                Social
              </option>
              <option value="Governance">
                Governance
              </option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this metric measures"
              className={inputClass}
              rows="3"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label
              htmlFor="unit"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Unit *
            </label>

            <input
              id="unit"
              name="unit"
              type="text"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g. tonnes CO2e, kWh, %"
              className={inputClass}
              required
            />
          </div>

          {/* Formula */}
          <div>
            <label
              htmlFor="formula"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Formula
            </label>

            <input
              id="formula"
              name="formula"
              type="text"
              value={formData.formula}
              onChange={handleChange}
              placeholder="e.g. Total emissions / revenue"
              className={inputClass}
            />
          </div>

          {/* Data Source */}
          <div>
            <label
              htmlFor="dataSource"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Data Source *
            </label>

            <input
              id="dataSource"
              name="dataSource"
              type="text"
              value={formData.dataSource}
              onChange={handleChange}
              placeholder="e.g. Energy bills"
              className={inputClass}
              required
            />
          </div>

          {/* Reporting Boundary */}
          <div>
            <label
              htmlFor="reportingBoundary"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Reporting Boundary *
            </label>

            <input
              id="reportingBoundary"
              name="reportingBoundary"
              type="text"
              value={formData.reportingBoundary}
              onChange={handleChange}
              placeholder="e.g. All company facilities"
              className={inputClass}
              required
            />
          </div>

          {/* Responsible Owner */}
          <div className="md:col-span-2">
            <label
              htmlFor="responsibleOwner"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Responsible Owner *
            </label>

            <input
              id="responsibleOwner"
              name="responsibleOwner"
              type="text"
              value={formData.responsibleOwner}
              onChange={handleChange}
              placeholder="e.g. Sustainability Manager"
              className={inputClass}
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "+ Add Metric"}
            </button>
          </div>
        </form>
      </section>

      {/* Metrics Table */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Defined Metrics
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View all registered ESG metrics.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading metrics...
          </div>
        ) : metrics.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No metrics found. Add your first ESG metric above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Metric
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Pillar
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Unit
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Data Source
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Responsible Owner
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {metrics.map((metric) => (
                  <tr
                    key={metric.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {metric.metricName}
                      </p>

                      <p className="mt-1 max-w-xs text-xs text-slate-500">
                        {metric.description}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          metric.pillar === "Environmental"
                            ? "bg-green-100 text-green-700"
                            : metric.pillar === "Social"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {metric.pillar}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {metric.unit}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {metric.dataSource}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {metric.responsibleOwner}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(metric.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
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

export default Metrics;