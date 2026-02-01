import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white shadow">
        <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6" aria-label="Main">
          <Link
            to="/"
            className="font-semibold text-lg hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
          >
            Mini Support Desk
          </Link>
          <Link
            to="/"
            className="text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
          >
            Tickets
          </Link>
          <Link
            to="/tickets/new"
            className="text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
          >
            New ticket
          </Link>
        </nav>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
