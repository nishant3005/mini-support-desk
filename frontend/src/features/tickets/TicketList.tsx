import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTickets } from "@/hooks/useTickets";
import { TableLoader } from "@/components/TableLoader";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SearchInput } from "@/components/SearchInput";
import { Select } from "@/components/Select";
import type { TicketStatus, TicketPriority } from "@/types";

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusBadge(status: TicketStatus) {
  const styles: Record<TicketStatus, string> = {
    OPEN: "bg-amber-100 text-amber-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-emerald-100 text-emerald-800",
  };
  const labels: Record<TicketStatus, string> = {
    OPEN: "Open",
    IN_PROGRESS: "In progress",
    RESOLVED: "Resolved",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function priorityBadge(priority: TicketPriority) {
  const styles: Record<TicketPriority, string> = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-slate-200 text-slate-800",
    HIGH: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

export function TicketList() {
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [sort, setSort] = useState<"createdAt:asc" | "createdAt:desc">("createdAt:desc");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 500);
    return () => clearTimeout(t);
  }, [q]);

  const params = {
    q: qDebounced.trim() || undefined,
    status: status || undefined,
    priority: priority || undefined,
    sort,
    page,
    limit,
  };

  const { data, isLoading, isError, error, refetch } = useTickets(params);

  if (isError) {
    return (
      <ErrorMessage
        message={error?.message ?? "Failed to load tickets"}
        onRetry={() => refetch()}
      />
    );
  }

  const { tickets, total, page: currentPage } = data ?? { tickets: [], total: 0, page: 1 };
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Tickets</h1>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SearchInput
              label="Search"
              placeholder="Title or description..."
              value={q}
              onChange={(val) => {
                setQ(val);
                setPage(1);
              }}
              aria-label="Search tickets by title or description"
            />
          </div>
          <Select
            label="Status"
            options={[{ value: "", label: "All" }, ...statusOptions]}
            value={status}
            onChange={(e) => {
              setStatus((e.target.value || "") as TicketStatus | "");
              setPage(1);
            }}
          />
          <Select
            label="Priority"
            options={[{ value: "", label: "All" }, ...priorityOptions]}
            value={priority}
            onChange={(e) => {
              setPriority((e.target.value || "") as TicketPriority | "");
              setPage(1);
            }}
          />
          <Select
            label="Sort"
            options={[
              { value: "createdAt:desc", label: "Newest first" },
              { value: "createdAt:asc", label: "Oldest first" },
            ]}
            value={sort}
            onChange={(e) =>
              setSort((e.target.value as "createdAt:asc" | "createdAt:desc") || "createdAt:desc")
            }
          />
        </div>
      </div>

      {isLoading ? (
        <TableLoader />
      ) : tickets.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          <p>No tickets found.</p>
          <Link
            to="/tickets/new"
            className="mt-2 inline-block text-slate-800 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
          >
            Create your first ticket
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200" role="table">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600"
                  >
                    Priority
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600"
                  >
                    Created
                  </th>
                  <th scope="col" className="relative px-4 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="font-medium text-slate-900 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{statusBadge(ticket.status)}</td>
                    <td className="px-4 py-3">{priorityBadge(ticket.priority)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-slate-600 hover:text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600">
                Page {currentPage} of {totalPages} ({total} tickets)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
