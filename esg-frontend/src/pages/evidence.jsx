import { useEffect, useState } from "react";
import api from "../services/api";

export default function Evidence() {
  const [evidenceList, setEvidenceList] = useState([]);
  const [metricEntries, setMetricEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialForm = {
    fileName: "",
    fileType: "",
    fileSize: "",
    filePath: "",
    uploadedBy: "",
    metricEntryId: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [evidenceResponse, entriesResponse] = await Promise.all([
        api.get("/evidence"),
        api.get("/metric-entries"),
      ]);

      setEvidenceList(evidenceResponse.data);
      setMetricEntries(entriesResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load evidence. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.metricEntryId) {
      setError("Please select a metric entry.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        fileName: formData.fileName.trim(),
        fileType: formData.fileType.trim(),
        fileSize: Number(formData.fileSize),
        filePath: formData.filePath.trim(),
        uploadedBy: formData.uploadedBy.trim(),
        metricEntry: {
          id: Number(formData.metricEntryId),
        },
      };

      await api.post("/evidence", payload);

      setSuccess("Evidence record added successfully!");
      setFormData(initialForm);

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save evidence. Please check your details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this evidence record?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await api.delete(`/evidence/${id}`);

      setEvidenceList((previous) =>
        previous.filter((item) => item.id !== id)
      );

      setSuccess("Evidence deleted successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete evidence."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Evidence Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage supporting documents for ESG metric entries.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Evidence Records
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {evidenceList.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Available Metric Entries
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {metricEntries.length}
            </h2>
          </div>
        </div>

        {/* Add Evidence Form */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Add Evidence
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* File Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  File Name *
                </label>

                <input
                  type="text"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                  placeholder="Electricity_Bill.pdf"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* File Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  File Type *
                </label>

                <select
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-600"
                >
                  <option value="">Select file type</option>
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                  <option value="Image">Image</option>
                  <option value="Document">Document</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* File Size */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  File Size (bytes) *
                </label>

                <input
                  type="number"
                  name="fileSize"
                  value={formData.fileSize}
                  onChange={handleChange}
                  placeholder="102400"
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600"
                />
              </div>

              {/* File Path */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  File Path *
                </label>

                <input
                  type="text"
                  name="filePath"
                  value={formData.filePath}
                  onChange={handleChange}
                  placeholder="evidence/electricity-bill.pdf"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600"
                />
              </div>

              {/* Uploaded By */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Uploaded By *
                </label>

                <input
                  type="text"
                  name="uploadedBy"
                  value={formData.uploadedBy}
                  onChange={handleChange}
                  placeholder="Admin"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-600"
                />
              </div>

              {/* Metric Entry */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Metric Entry *
                </label>

                <select
                  name="metricEntryId"
                  value={formData.metricEntryId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-600"
                >
                  <option value="">Select metric entry</option>

                  {metricEntries.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.metricDefinition?.metricName ||
                        `Metric Entry #${entry.id}`}{" "}
                      — {entry.metricValue} {entry.unit || ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving || metricEntries.length === 0}
                className="rounded-lg bg-green-700 px-6 py-2.5 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add Evidence"}
              </button>
            </div>

            {metricEntries.length === 0 && !loading && (
              <p className="mt-3 text-sm text-amber-700">
                Create a metric entry before adding evidence.
              </p>
            )}
          </form>
        </div>

        {/* Evidence Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Evidence Records
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading evidence records...
            </div>
          ) : evidenceList.length === 0 ? (
            <div className="p-10 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                No evidence records found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first evidence record using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">ID</th>
                    <th className="px-5 py-4 font-semibold">File Name</th>
                    <th className="px-5 py-4 font-semibold">Type</th>
                    <th className="px-5 py-4 font-semibold">Size</th>
                    <th className="px-5 py-4 font-semibold">Metric</th>
                    <th className="px-5 py-4 font-semibold">Uploaded By</th>
                    <th className="px-5 py-4 font-semibold">Uploaded At</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {evidenceList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">{item.id}</td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {item.fileName}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {item.fileType || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {item.fileSize != null
                          ? `${Number(item.fileSize).toLocaleString()} bytes`
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        {item.metricEntry?.metricDefinition?.metricName ||
                          (item.metricEntry?.id
                            ? `Entry #${item.metricEntry.id}`
                            : "-")}
                      </td>

                      <td className="px-5 py-4">
                        {item.uploadedBy || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {formatDate(item.uploadedAt)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-600 hover:bg-red-100"
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
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Note: This page stores evidence metadata and a file path. It does not
          upload actual files to the server.
        </p>
      </div>
    </div>
  );
}