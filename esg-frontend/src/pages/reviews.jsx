import { useEffect, useState } from "react";
import api from "../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [metricEntries, setMetricEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialForm = {
    reviewerName: "",
    decision: "Pending",
    comment: "",
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
      const [reviewResponse, entryResponse] = await Promise.all([
        api.get("/reviews"),
        api.get("/metric-entries"),
      ]);

      setReviews(reviewResponse.data);
      setMetricEntries(entryResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load reviews. Check your backend."
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
        reviewerName: formData.reviewerName.trim(),
        decision: formData.decision,
        comment: formData.comment.trim(),
        metricEntry: {
          id: Number(formData.metricEntryId),
        },
      };

      await api.post("/reviews", payload);

      setSuccess("Review submitted successfully!");
      setFormData(initialForm);

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const getDecisionStyle = (decision) => {
    switch (decision?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "changes requested":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reviews & Approvals
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review ESG metric submissions and record decisions.
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
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Reviews
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {reviews.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Approved
            </p>
            <p className="mt-3 text-3xl font-bold text-green-600">
              {
                reviews.filter(
                  (review) =>
                    review.decision?.toLowerCase() === "approved"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Changes Requested / Rejected
            </p>
            <p className="mt-3 text-3xl font-bold text-orange-600">
              {
                reviews.filter((review) =>
                  ["changes requested", "rejected"].includes(
                    review.decision?.toLowerCase()
                  )
                ).length
              }
            </p>
          </div>
        </div>

        {/* Add Review */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Record a Review
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reviewer Name *
                </label>

                <input
                  type="text"
                  name="reviewerName"
                  value={formData.reviewerName}
                  onChange={handleChange}
                  placeholder="Enter reviewer name"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Decision *
                </label>

                <select
                  name="decision"
                  value={formData.decision}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-600"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Changes Requested">
                    Changes Requested
                  </option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Metric Entry *
                </label>

                <select
                  name="metricEntryId"
                  value={formData.metricEntryId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-600"
                >
                  <option value="">Select a metric entry</option>

                  {metricEntries.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.metricDefinition?.metricName ||
                        `Metric Entry #${entry.id}`}{" "}
                      — {entry.metricValue} {entry.unit || ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Review Comment
                </label>

                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter feedback or review notes"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving || metricEntries.length === 0}
                className="rounded-lg bg-blue-700 px-6 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Submit Review"}
              </button>
            </div>

            {metricEntries.length === 0 && !loading && (
              <p className="mt-3 text-sm text-orange-700">
                Create a metric entry before recording a review.
              </p>
            )}
          </form>
        </div>

        {/* Reviews Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Review History
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No reviews found. Record your first review above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">ID</th>
                    <th className="px-5 py-4 font-semibold">Metric</th>
                    <th className="px-5 py-4 font-semibold">Reviewer</th>
                    <th className="px-5 py-4 font-semibold">Decision</th>
                    <th className="px-5 py-4 font-semibold">Comment</th>
                    <th className="px-5 py-4 font-semibold">Reviewed At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">{review.id}</td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {review.metricEntry?.metricDefinition?.metricName ||
                          (review.metricEntry?.id
                            ? `Entry #${review.metricEntry.id}`
                            : "-")}
                      </td>

                      <td className="px-5 py-4">
                        {review.reviewerName || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getDecisionStyle(
                            review.decision
                          )}`}
                        >
                          {review.decision || "-"}
                        </span>
                      </td>

                      <td className="max-w-xs whitespace-normal px-5 py-4">
                        {review.comment || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {formatDate(review.reviewedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}