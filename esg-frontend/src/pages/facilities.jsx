import { useEffect, useState } from "react";
import api from "../services/api";

function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    facilityName: "",
    location: "",
    organizationId: "",
  });

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [facilityResponse, organizationResponse] = await Promise.all([
        api.get("/facilities"),
        api.get("/organizations"),
      ]);

      setFacilities(
        Array.isArray(facilityResponse.data) ? facilityResponse.data : []
      );

      setOrganizations(
        Array.isArray(organizationResponse.data)
          ? organizationResponse.data
          : []
      );
    } catch (err) {
      console.error("Error fetching facilities:", err);
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

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.facilityName.trim() ||
      !formData.location.trim() ||
      !formData.organizationId
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        facilityName: formData.facilityName.trim(),
        location: formData.location.trim(),
        organization: {
          id: Number(formData.organizationId),
        },
      };

      await api.post("/facilities", payload);

      setFormData({
        facilityName: "",
        location: "",
        organizationId: "",
      });

      setSuccess("Facility created successfully!");

      await fetchData();
    } catch (err) {
      console.error("Error creating facility:", err);

      setError(
        err.response?.data?.message ||
          `Failed to create facility. HTTP status: ${
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
        <h1 className="text-3xl font-bold text-slate-800">Facilities</h1>
        <p className="mt-2 text-slate-500">
          Manage facilities belonging to your reporting organizations.
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
          Add Facility
        </h2>

        {organizations.length === 0 && !loading && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-amber-800">
            Add an organization before creating a facility.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="facilityName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Facility Name *
            </label>

            <input
              id="facilityName"
              name="facilityName"
              value={formData.facilityName}
              onChange={handleChange}
              placeholder="e.g. Bangalore Manufacturing Plant"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Location *
            </label>

            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore, Karnataka, India"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

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
                <option key={organization.id} value={organization.id}>
                  {organization.organizationName ||
                    `Organization #${organization.id}`}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving || organizations.length === 0}
            className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "+ Add Facility"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Facility List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Total facilities: {facilities.length}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading facilities...
          </p>
        ) : facilities.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No facilities found. Add your first facility above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Facility Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Organization</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {facilities.map((facility) => (
                  <tr key={facility.id}>
                    <td className="px-6 py-4">{facility.id}</td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {facility.facilityName || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {facility.location || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {facility.organization?.organizationName || "—"}
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

export default Facilities;