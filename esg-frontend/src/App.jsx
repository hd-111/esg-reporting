import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar";

import Organizations from "./pages/Organizations";
import ReportingPeriods from "./pages/reportingPeriods";
import Facilities from "./pages/facilities";
import Metrics from "./pages/metrics";
import MetricEntries from "./pages/metricentries";
import Evidence from "./pages/evidence";
import Reviews from "./pages/reviews";
import Reports from "./pages/reports";
import Users from "./pages/users";

function Dashboard() {
  const cards = [
    {
      title: "Organizations",
      description: "Manage reporting organizations",
      path: "/organizations",
    },
    {
      title: "Reporting Periods",
      description: "Manage reporting periods",
      path: "/reporting-periods",
    },
    {
      title: "Facilities",
      description: "Manage facilities and locations",
      path: "/facilities",
    },
    {
      title: "ESG Metrics",
      description: "Manage ESG metric definitions",
      path: "/metrics",
    },
    {
      title: "Metric Entries",
      description: "Record ESG performance data",
      path: "/metric-entries",
    },
    {
      title: "Evidence",
      description: "Manage supporting evidence records",
      path: "/evidence",
    },
    {
      title: "Reviews",
      description: "Review and approve metric submissions",
      path: "/reviews",
    },
    {
      title: "Reports",
      description: "Analyze ESG performance and export reports",
      path: "/reports",
    },
    {
      title: "Users",
      description: "Manage users and access permissions",
      path: "/users",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-700 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-200">
          ESG Reporting Platform
        </p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Welcome to ESG Reporting
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
          Manage your organization's environmental, social, and governance
          reporting data in one place. Track metrics, maintain evidence,
          review submissions, and generate ESG reports.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/metric-entries"
            className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
          >
            Add Metric Entry
          </a>

          <a
            href="/reports"
            className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Reports
          </a>
        </div>
      </div>

      {/* Workspace Cards */}
      <section>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-800">
            Reporting Workspace
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a module to manage your ESG reporting information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <a
              key={card.path}
              href={card.path}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl font-bold text-emerald-700 transition group-hover:bg-emerald-100">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600">
                  →
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                {card.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>

              <p className="mt-5 text-sm font-semibold text-emerald-700">
                Open module →
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">
          ESG Reporting Workflow
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Follow these steps to manage reporting data.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              number: "01",
              title: "Configure",
              description:
                "Create organizations, facilities, and reporting periods.",
            },
            {
              number: "02",
              title: "Define Metrics",
              description:
                "Set up environmental, social, and governance metrics.",
            },
            {
              number: "03",
              title: "Submit Data",
              description:
                "Record metric values and maintain supporting evidence.",
            },
            {
              number: "04",
              title: "Review & Report",
              description:
                "Review submissions and export ESG reports.",
            },
          ].map((step) => (
            <div
              key={step.number}
              className="rounded-xl bg-slate-50 p-5"
            >
              <p className="text-sm font-bold text-emerald-700">
                STEP {step.number}
              </p>

              <h3 className="mt-3 font-bold text-slate-800">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">
        {title}
      </h1>

      <p className="mt-3 text-slate-500">
        {description}
      </p>

      <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        This module has not been implemented yet.
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Organizations */}
          <Route
            path="/organizations"
            element={<Organizations />}
          />

          {/* Reporting Periods */}
          <Route
            path="/reporting-periods"
            element={<ReportingPeriods />}
          />

          {/* Facilities */}
          <Route
            path="/facilities"
            element={<Facilities />}
          />

          {/* ESG Metrics */}
          <Route
            path="/metrics"
            element={<Metrics />}
          />

          {/* Metric Entries */}
          <Route
            path="/metric-entries"
            element={<MetricEntries />}
          />

          {/* Evidence */}
          <Route
            path="/evidence"
            element={<Evidence />}
          />

          {/* Reviews */}
          <Route
            path="/reviews"
            element={<Reviews />}
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={<Reports />}
          />

          {/* Users */}
          <Route
            path="/users"
            element={<Users />}
          />

          {/* Page Not Found */}
          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page Not Found"
                description="The requested page does not exist."
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;