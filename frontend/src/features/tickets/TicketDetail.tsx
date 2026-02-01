import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTicket, useUpdateTicket } from "@/hooks/useTickets";
import { useComments, useCreateComment } from "@/hooks/useComments";
import { CircularLoader } from "@/components/CircularLoader";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import type { TicketStatus, TicketPriority } from "@/types";

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentErrors, setCommentErrors] = useState<{ authorName?: string; message?: string }>({});
  const [commentsPage, setCommentsPage] = useState(1);

  const { data: ticket, isLoading, isError, error, refetch } = useTicket(id);
  const updateTicket = useUpdateTicket(id ?? "");

  const { data: commentsData, isLoading: commentsLoading } = useComments(
    id,
    commentsPage,
    20,
    !!id
  );
  const createComment = useCreateComment(id ?? "");

  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicket.mutate({ status: newStatus });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const err: { authorName?: string; message?: string } = {};
    if (!commentAuthor.trim()) err.authorName = "Author name is required";
    if (!commentMessage.trim()) err.message = "Message is required";
    else if (commentMessage.length > 500) err.message = "Message must be at most 500 characters";
    setCommentErrors(err);
    if (Object.keys(err).length > 0) return;

    createComment.mutate(
      { authorName: commentAuthor.trim(), message: commentMessage.trim() },
      {
        onSuccess: () => {
          setCommentAuthor("");
          setCommentMessage("");
          setCommentErrors({});
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <CircularLoader size="lg" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
        >
          ← Back to tickets
        </Link>
        <ErrorMessage
          message={error?.message ?? "Ticket not found"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { comments, total: commentsTotal, page: commentsCurrentPage } = commentsData ?? {
    comments: [],
    total: 0,
    page: 1,
  };
  const commentsLimit = 20;
  const commentsTotalPages = Math.ceil(commentsTotal / commentsLimit);

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-block text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
      >
        ← Back to tickets
      </Link>

      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{ticket.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {statusBadge(ticket.status)}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {ticket.priority}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="status-select" className="text-sm font-medium text-slate-700">
              Status:
            </label>
            <select
              id="status-select"
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
              disabled={updateTicket.isPending}
              className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-50"
              aria-label="Change ticket status"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {updateTicket.isPending && (
              <span className="text-sm text-slate-500">Saving…</span>
            )}
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-slate-700">{ticket.description}</p>

        <p className="mt-4 text-sm text-slate-500">
          Created {formatDate(ticket.createdAt)} · Updated {formatDate(ticket.updatedAt)}
        </p>
      </article>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" aria-label="Comments">
        <h2 className="text-lg font-semibold text-slate-900">Comments</h2>

        <form onSubmit={handleSubmitComment} className="mt-4 space-y-4">
          <Input
            label="Your name"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            error={commentErrors.authorName}
            placeholder="e.g. Jane Doe"
            maxLength={100}
          />
          <Textarea
            label="Message"
            value={commentMessage}
            onChange={(e) => setCommentMessage(e.target.value)}
            error={commentErrors.message}
            placeholder="Write a comment..."
            rows={3}
            maxLength={500}
          />
          {createComment.isError && (
            <p className="text-sm text-red-600" role="alert">
              {createComment.error?.message}
            </p>
          )}
          <Button type="submit" loading={createComment.isPending}>
            Add comment
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          {commentsLoading ? (
            <div className="flex justify-center py-4">
              <CircularLoader size="md" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-slate-500 text-sm">No comments yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {comments.map((c) => (
                <li key={c.id} className="py-4 first:pt-0">
                  <p className="font-medium text-slate-900">{c.authorName}</p>
                  <p className="mt-1 text-sm text-slate-700">{c.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(c.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}

          {commentsTotalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-600">
                Page {commentsCurrentPage} of {commentsTotalPages} ({commentsTotal} comments)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCommentsPage((p) => Math.max(1, p - 1))}
                  disabled={commentsCurrentPage <= 1}
                  className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCommentsPage((p) => Math.min(commentsTotalPages, p + 1))
                  }
                  disabled={commentsCurrentPage >= commentsTotalPages}
                  className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
