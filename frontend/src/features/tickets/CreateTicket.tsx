import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTicket } from "@/hooks/useTickets";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Select } from "@/components/Select";
import type { TicketPriority } from "@/types";

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export function CreateTicket() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: { title?: string; description?: string } = {};
    if (!title.trim()) err.title = "Title is required";
    else if (title.length < 5) err.title = "Title must be at least 5 characters";
    else if (title.length > 80) err.title = "Title must be at most 80 characters";
    if (!description.trim()) err.description = "Description is required";
    else if (description.length < 20)
      err.description = "Description must be at least 20 characters";
    else if (description.length > 2000)
      err.description = "Description must be at most 2000 characters";
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    createTicket.mutate(
      { title: title.trim(), description: description.trim(), priority },
      {
        onSuccess: (data) => {
          navigate(`/tickets/${data.id}`);
        },
      }
    );
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Create ticket</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          placeholder="Brief summary (5–80 characters)"
          minLength={5}
          maxLength={80}
          required
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          placeholder="Describe the issue in detail (20–2000 characters)"
          rows={6}
          minLength={20}
          maxLength={2000}
          required
        />
        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(e) => setPriority((e.target.value as TicketPriority) || "MEDIUM")}
        />

        {createTicket.isError && (
          <p className="text-sm text-red-600" role="alert">
            {createTicket.error?.message}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={createTicket.isPending}>
            Create ticket
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
