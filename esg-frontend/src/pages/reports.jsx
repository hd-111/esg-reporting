import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const pillars = [
  {
    name: "Environmental",
    color: "emerald",
    keywords: ["environmental", "environment"],
  },
  {
    name: "Social",
    color: "blue",
    keywords: ["social"],
  },
  {
    name: "Governance",
    color: "violet",
    keywords: ["governance"],
  },
];

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getStatusClass(status) {
  const value = normalize(status);

  if (value === "approved") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (value === "pending") {
    return "bg-amber-100 text-amber-700";
  }

  if (
    value === "rejected" ||
    value === "changes requested" ||
    value === "changes_requested"
  ) {
    return "bg-red-100 text-red-700";
  }

  if (value === "submitted") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-slate-100 text-slate-600";
}

function Reports() {
  const [organizations, setOrganizations] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [entries, setEntries] = useState([]);

  const [organizationId, setOrganizationId] = useState("all");
  const [periodId, setPeriodId] = useState("all");
  const [pillarFilter, setPillarFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReportData();
  }, []);

  async function loadReportData() {
    setLoading(true);
    setError("");

    try {
      const [organizationResponse, periodResponse, entryResponse] =
        await Promise.all([
          api.get("/organizations"),
          api.get("/reporting-periods"),
          api.get("/metric-entries"),
        ]);

      setOrganizations(organizationResponse.data);
      setPeriods(periodResponse.data);
      setEntries(entryResponse.data);
    } catch (err) {
      console.error("Failed to load reports:", err);

      setError(
        "Unable to load report data. Check that the Spring Boot backend is running on port 8081."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredPeriods = useMemo(() => {
    if (organizationId === "all") {
      return periods;
    }

    return periods.filter(
      (period) =>
        String(period.organization?.id) === String(organizationId)
    );
  }, [periods, organizationId]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesOrganization =
        organizationId === "all" ||
        String(entry.reportingPeriod?.organization?.id) ===
          String(organizationId);

      const matchesPeriod =
        periodId === "all" ||
        String(entry.reportingPeriod?.id) === String(periodId);

      const pillar = normalize(entry.metricDefinition?.pillar);

      const matchesPillar =
        pillarFilter === "all" ||
        pillar === normalize(pillarFilter);

      return (
        matchesOrganization &&
        matchesPeriod &&
        matchesPillar
      );
    });
  }, [entries, organizationId, periodId, pillarFilter]);

  const selectedOrganization = organizations.find(
    (organization) => String(organization.id) === String(organizationId)
  );

  const selectedPeriod = periods.find(
    (period) => String(period.id) === String(periodId)
  );

  const approvedCount = filteredEntries.filter(
    (entry) => normalize(entry.reviewStatus) === "approved"
  ).length;

  const pendingCount = filteredEntries.filter(
    (entry) => normalize(entry.reviewStatus) === "pending"
  ).length;

  const rejectedCount = filteredEntries.filter((entry) => {
    const status = normalize(entry.reviewStatus);

    return (
      status === "rejected" ||
      status === "changes requested" ||
      status === "changes_requested"
    );
  }).length;

  const submittedCount = filteredEntries.filter(
    (entry) => normalize(entry.dataStatus) === "submitted"
  ).length;

  function getPillarEntries(pillarName) {
    return filteredEntries.filter(
      (entry) =>
        normalize(entry.metricDefinition?.pillar) ===
        normalize(pillarName)
    );
  }

  function exportCSV() {
    if (filteredEntries.length === 0) {
      alert("No metric entries available to export.");
      return;
    }

    const headers = [
      "Organization",
      "Reporting Period",
      "Start Date",
      "End Date",
      "Facility",
      "Metric Name",
      "Pillar",
      "Metric Value",
      "Unit",
      "Data Status",
      "Review Status",
      "Measurement Method",
      "Source",
      "Notes",
      "Created At",
    ];

    const rows = filteredEntries.map((entry) => [
      entry.reportingPeriod?.organization?.organizationName || "",
      entry.reportingPeriod?.periodName || "",
      entry.reportingPeriod?.startDate || "",
      entry.reportingPeriod?.endDate || "",
      entry.facility?.facilityName || "",
      entry.metricDefinition?.metricName || "",
      entry.metricDefinition?.pillar || "",
      entry.metricValue ?? "",
      entry.unit || "",
      entry.dataStatus || "",
      entry.reviewStatus || "",
      entry.measurementMethod || "",
      entry.source || "",
      entry.notes || "",
      entry.createdAt || "",
    ]);

    const escapeCSV = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ESG_Report.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function resetFilters() {
    setOrganizationId("all");
    setPeriodId("all");
    setPillarFilter("all");
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
          <p className="mt-4 text-sm text-slate-500">
            Loading ESG reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-700 p-7 text-white shadow-lg md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Analytics & Reporting
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            ESG Reports
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50">
            Analyze environmental, social, and governance performance using
            your recorded metric entries.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50"
        >
          ↓ Export CSV
        </button>
      </section>

      {/* Error */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:flex-row md:items-center md:justify-between">
          <p>{error}</p>

          <button
            onClick={loadReportData}
            className="w-fit rounded-lg bg-red-100 px-4 py-2 font-semibold hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Report Filters
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Filter report data by organization, period, and ESG pillar.
            </p>
          </div>

          <button
            onClick={loadReportData}
            className="w-fit rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Organization
            </label>

            <select
              value={organizationId}
              onChange={(event) => {
                setOrganizationId(event.target.value);
                setPeriodId("all");
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All Organizations</option>

              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.organizationName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Reporting Period
            </label>

            <select
              value={periodId}
              onChange={(event) => setPeriodId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All Reporting Periods</option>

              {filteredPeriods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.periodName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              ESG Pillar
            </label>

            <select
              value={pillarFilter}
              onChange={(event) => setPillarFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All ESG Pillars</option>
              <option value="Environmental">Environmental</option>
              <option value="Social">Social</option>
              <option value="Governance">Governance</option>
            </select>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          Clear all filters
        </button>
      </section>

      {/* Reporting information */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Organization</p>

          <h3 className="mt-2 text-lg font-bold text-slate-800">
            {selectedOrganization?.organizationName ||
              (organizationId === "all"
                ? "All Organizations"
                : "Organization")}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            {selectedOrganization?.industry || "Multiple industries"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Reporting Period</p>

          <h3 className="mt-2 text-lg font-bold text-slate-800">
            {selectedPeriod?.periodName || "All Reporting Periods"}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            {selectedPeriod
              ? `${formatDate(selectedPeriod.startDate)} – ${formatDate(
                  selectedPeriod.endDate
                )}`
              : "Select a period to view its dates"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Reporting Boundary</p>

          <h3 className="mt-2 text-lg font-bold text-slate-800">
            {selectedPeriod?.reportingBoundary || "Multiple Boundaries"}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            Based on the selected reporting period
          </p>
        </div>
      </section>

      {/* Summary cards */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-800">
          Reporting Summary
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Metric Entries",
              value: filteredEntries.length,
              description: "Records matching your filters",
              color: "text-slate-800",
            },
            {
              title: "Submitted Entries",
              value: submittedCount,
              description: "Entries marked as submitted",
              color: "text-blue-700",
            },
            {
              title: "Approved Entries",
              value: approvedCount,
              description: "Entries marked as approved",
              color: "text-emerald-700",
            },
            {
              title: "Pending Reviews",
              value: pendingCount,
              description: `${rejectedCount} rejected or requiring changes`,
              color: "text-amber-700",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <p className={`mt-3 text-3xl font-bold ${card.color}`}>
                {card.value}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ESG pillar cards */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            ESG Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Metric values are displayed in their original units. Different
            metrics should not be added together because their units differ.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {pillars.map((pillar) => {
            const pillarEntries = getPillarEntries(pillar.name);

            const approved = pillarEntries.filter(
              (entry) => normalize(entry.reviewStatus) === "approved"
            ).length;

            const colorClasses = {
              Environmental: {
                border: "border-t-emerald-500",
                badge: "bg-emerald-100 text-emerald-700",
              },
              Social: {
                border: "border-t-blue-500",
                badge: "bg-blue-100 text-blue-700",
              },
              Governance: {
                border: "border-t-violet-500",
                badge: "bg-violet-100 text-violet-700",
              },
            };

            return (
              <div
                key={pillar.name}
                className={`overflow-hidden rounded-2xl border border-slate-200 border-t-4 ${colorClasses[pillar.name].border} bg-white shadow-sm`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-800">
                      {pillar.name}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${colorClasses[pillar.name].badge}`}
                    >
                      {pillarEntries.length} entries
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {pillar.name === "Environmental" &&
                      "Emissions, energy, water, and waste."}

                    {pillar.name === "Social" &&
                      "Workforce diversity and employee development."}

                    {pillar.name === "Governance" &&
                      "Board composition and corporate governance."}
                  </p>

                  <div className="mt-5 space-y-3">
                    {pillarEntries.length === 0 ? (
                      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                        No metric entries found for this pillar.
                      </div>
                    ) : (
                      pillarEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-xl bg-slate-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-semibold text-slate-800">
                                {entry.metricDefinition?.metricName ||
                                  "Unnamed Metric"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {entry.facility?.facilityName ||
                                  "No facility"}
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="font-bold text-slate-800">
                                {formatNumber(entry.metricValue)}
                              </p>

                              <p className="text-xs text-slate-500">
                                {entry.unit ||
                                  entry.metricDefinition?.unit ||
                                  ""}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                entry.reviewStatus
                              )}`}
                            >
                              {entry.reviewStatus || "Not Reviewed"}
                            </span>

                            <span className="text-xs text-slate-500">
                              {entry.reportingPeriod?.periodName || ""}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <span className="text-slate-500">
                      Approved entries
                    </span>

                    <span className="font-bold text-emerald-700">
                      {approved} / {pillarEntries.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Complete data table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Detailed Metric Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete metric entry records matching your filters.
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            {filteredEntries.length} records
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl">📊</div>

            <h3 className="mt-4 font-bold text-slate-800">
              No report data available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Create metric entries or change the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Metric</th>
                  <th className="px-5 py-4">Pillar</th>
                  <th className="px-5 py-4">Value</th>
                  <th className="px-5 py-4">Organization</th>
                  <th className="px-5 py-4">Period</th>
                  <th className="px-5 py-4">Facility</th>
                  <th className="px-5 py-4">Data Status</th>
                  <th className="px-5 py-4">Review Status</th>
                  <th className="px-5 py-4">Created At</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {entry.metricDefinition?.metricName || "-"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {entry.metricDefinition?.pillar || "-"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {formatNumber(entry.metricValue)}{" "}
                      <span className="font-normal text-slate-500">
                        {entry.unit ||
                          entry.metricDefinition?.unit ||
                          ""}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {entry.reportingPeriod?.organization
                        ?.organizationName || "-"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {entry.reportingPeriod?.periodName || "-"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {entry.facility?.facilityName || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                          entry.dataStatus
                        )}`}
                      >
                        {entry.dataStatus || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                          entry.reviewStatus
                        )}`}
                      >
                        {entry.reviewStatus || "Not Reviewed"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(entry.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-xs leading-5 text-slate-500">
        <strong className="text-slate-700">Report note:</strong>{" "}
        This report summarizes the metric entries currently stored in the
        application. Values are presented as recorded and have not been
        independently verified. The CSV export contains the filtered
        records and their reporting details.
      </footer>
    </div>
  );
}

export default Reports;