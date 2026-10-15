import { useEffect, useState } from "react";
import api from "../services/api";

function MetricEntries() {
  const [entries, setEntries] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [formData, setFormData] = useState({
    metricValue: "",
    unit: "",
    dataStatus: "Submitted",
    measurementMethod: "",
    notes: "",
    source: "",
    reviewStatus: "Pending",
    metricDefinitionId: "",
    reportingPeriodId: "",
    facilityId: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entryResponse, definitionResponse, periodResponse, facilityResponse] =
        await Promise.all([
          api.get("/metric-entries"),
          api.get("/metric-definitions"),
          api.get("/reporting-periods"),
          api.get("/facilities"),
        ]);

      setEntries(entryResponse.data);
      setDefinitions(definitionResponse.data);
      setPeriods(periodResponse.data);
      setFacilities(facilityResponse.data);
    } catch (err) {
      console.error("Failed to load metric entry data:", err);
      setError(
        "Could not load data. Check that the backend is running and the API endpoints are correct."
      );
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name === "metricDefinitionId") {
      const selectedDefinition = definitions.find(
        (definition) => String(definition.id) === value
      );

      if (selectedDefinition) {
        setFormData((previous) => ({
          ...previous,
          metricDefinitionId: value,
          unit: selectedDefinition.unit || "",
        }));
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.metricDefinitionId ||
      !formData.reportingPeriodId ||
      !formData.facilityId
    ) {
      setError("Please select a metric, reporting period, and facility.");
      return;
    }

    try {
      const payload = {
        metricValue: Number(formData.metricValue),
        unit: formData.unit,
        dataStatus: formData.dataStatus,
        measurementMethod: formData.measurementMethod,
        notes: formData.notes,
        source: formData.source,
        reviewStatus: formData.reviewStatus,
        metricDefinition: {
          id: Number(formData.metricDefinitionId),
        },
        reportingPeriod: {
          id: Number(formData.reportingPeriodId),
        },
        facility: {
          id: Number(formData.facilityId),
        },
      };

      await api.post("/metric-entries", payload);

      setMessage("Metric entry added successfully!");

      setFormData({
        metricValue: "",
        unit: "",
        dataStatus: "Submitted",
        measurementMethod: "",
        notes: "",
        source: "",
        reviewStatus: "Pending",
        metricDefinitionId: "",
        reportingPeriodId: "",
        facilityId: "",
      });

      await loadData();
    } catch (err) {
      console.error("Failed to save metric entry:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save metric entry. Check the backend logs."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this metric entry?")) {
      return;
    }

    try {
      await api.delete(`/metric-entries/${id}`);
      setMessage("Metric entry deleted successfully!");
      setError("");
      await loadData();
    } catch (err) {
      console.error("Failed to delete metric entry:", err);
      setError("Failed to delete metric entry.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">
          Metric Entries
        </h1>

        <p className="mt-2 text-slate-500">
          Record and manage measured ESG values for your facilities and
          reporting periods.
        </p>
      </header>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          Add Metric Entry
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Enter the measured value and select the associated ESG records.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>ESG Metric *</label>

              <select
                name="metricDefinitionId"
                value={formData.metricDefinitionId}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select metric</option>

                {definitions.map((definition) => (
                  <option key={definition.id} value={definition.id}>
                    {definition.metricName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Metric Value *</label>

              <input
                type="number"
                name="metricValue"
                value={formData.metricValue}
                onChange={handleChange}
                className={inputClass}
                step="any"
                required
                placeholder="e.g. 125.5"
              />
            </div>

            <div>
              <label className={labelClass}>Unit *</label>

              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={inputClass}
                required
                placeholder="e.g. tCO2e"
              />
            </div>

            <div>
              <label className={labelClass}>Reporting Period *</label>

              <select
                name="reportingPeriodId"
                value={formData.reportingPeriodId}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select reporting period</option>

                {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.periodName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Facility *</label>

              <select
                name="facilityId"
                value={formData.facilityId}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select facility</option>

                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.facilityName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Data Status</label>

              <select
                name="dataStatus"
                value={formData.dataStatus}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Measurement Method</label>

              <input
                type="text"
                name="measurementMethod"
                value={formData.measurementMethod}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Activity-based calculation"
              />
            </div>

            <div>
              <label className={labelClass}>Source</label>

              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Utility bills"
              />
            </div>

            <div>
              <label className={labelClass}>Review Status</label>

              <select
                name="reviewStatus"
                value={formData.reviewStatus}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Changes Requested">Changes Requested</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Notes</label>

              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={inputClass}
                placeholder="Additional information"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Save Metric Entry
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Recorded Metric Entries
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Total entries: {entries.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4 font-semibold">Metric</th>
                <th className="px-5 py-4 font-semibold">Value</th>
                <th className="px-5 py-4 font-semibold">Unit</th>
                <th className="px-5 py-4 font-semibold">Reporting Period</th>
                <th className="px-5 py-4 font-semibold">Facility</th>
                <th className="px-5 py-4 font-semibold">Review Status</th>
                <th className="px-5 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {entry.metricDefinition?.metricName || "—"}
                  </td>

                  <td className="px-5 py-4">
                    {entry.metricValue ?? "—"}
                  </td>

                  <td className="px-5 py-4">{entry.unit || "—"}</td>

                  <td className="px-5 py-4">
                    {entry.reportingPeriod?.periodName || "—"}
                  </td>

                  <td className="px-5 py-4">
                    {entry.facility?.facilityName || "—"}
                  </td>

                  <td className="px-5 py-4">
                    {entry.reviewStatus || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No metric entries found. Add your first entry above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default MetricEntries;