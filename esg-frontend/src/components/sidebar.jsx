import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Organizations", path: "/organizations" },
    { name: "Reporting Periods", path: "/reporting-periods" },
    { name: "Facilities", path: "/facilities" },
    { name: "ESG Metrics", path: "/metrics" },
    { name: "Metric Entries", path: "/metric-entries" },
    { name: "Evidence", path: "/evidence" },
    { name: "Reviews", path: "/reviews" },
    { name: "Reports", path: "/reports" },
    { name: "User Management", path: "/users" },
  ];

  return (
    <aside className="flex min-h-screen w-72 flex-col bg-slate-900 px-5 py-8 text-white">
      {/* Logo and Heading */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          ESG Report
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Sustainability Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-8 border-t border-slate-700 pt-5 text-center">
        <p className="text-xs text-slate-400">
          ESG Reporting System
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Version 1.0
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;