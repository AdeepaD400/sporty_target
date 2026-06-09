"use client";

import { useState } from "react";
import type { Sport } from "@/lib/types";

type SportsPanelProps = {
  sports: Sport[];
  onAdd: (name: string) => string | null;
  onUpdate: (id: string, name: string) => string | null;
  onDelete: (id: string) => void;
  getPracticeCount: (sportId: string) => number;
};

export function SportsPanel({
  sports,
  onAdd,
  onUpdate,
  onDelete,
  getPracticeCount,
}: SportsPanelProps) {
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const err = onAdd(newName);
    if (err) {
      setError(err);
      return;
    }
    setNewName("");
    setError(null);
  };

  const startEdit = (sport: Sport) => {
    setEditingId(sport.id);
    setEditName(sport.name);
    setError(null);
  };

  const handleUpdate = (id: string) => {
    const err = onUpdate(id, editName);
    if (err) {
      setError(err);
      return;
    }
    setEditingId(null);
    setEditName("");
    setError(null);
  };

  const handleDelete = (sport: Sport) => {
    const count = getPracticeCount(sport.id);
    const message =
      count > 0
        ? `Delete "${sport.name}"? This will also remove ${count} practice${count > 1 ? "s" : ""}.`
        : `Delete "${sport.name}"?`;

    if (window.confirm(message)) {
      onDelete(sport.id);
      if (editingId === sport.id) setEditingId(null);
    }
  };

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:w-72">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sports</h2>
        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
          {sports.length}
        </span>
      </div>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            setError(null);
          }}
          placeholder="Add a sport..."
          maxLength={30}
          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          Add
        </button>
      </form>

      {error && (
        <p className="mb-3 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      <ul className="flex flex-col gap-2 overflow-y-auto">
        {sports.map((sport) => (
          <li
            key={sport.id}
            className="group flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2 transition hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:border-zinc-700"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: sport.color }}
              aria-hidden
            />

            {editingId === sport.id ? (
              <div className="flex flex-1 gap-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={30}
                  className="flex-1 rounded border border-zinc-200 bg-white px-2 py-1 text-sm outline-none focus:border-teal-500 dark:border-zinc-600 dark:bg-zinc-900"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdate(sport.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleUpdate(sport.id)}
                  className="rounded px-2 text-xs font-medium text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {sport.name}
                </span>
                <div className="flex gap-0.5 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => startEdit(sport)}
                    className="rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                    aria-label={`Edit ${sport.name}`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(sport)}
                    className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
                    aria-label={`Delete ${sport.name}`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {sports.length === 0 && (
        <p className="mt-2 text-center text-xs text-zinc-400">Add sports to start scheduling</p>
      )}
    </aside>
  );
}
