"use client";

import { useState } from "react";
import type { PracticeFormData, PracticeSlot, Sport } from "@/lib/types";

type PracticeModalProps = {
  open: boolean;
  sports: Sport[];
  editingPractice: PracticeSlot | null;
  initialDate?: string;
  initialStartTime?: string;
  onClose: () => void;
  onSave: (form: PracticeFormData, id?: string) => string | null;
  onDelete?: (id: string) => void;
  getOverlappingPractices: (slot: {
    id?: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => PracticeSlot[];
};

function buildInitialForm(
  editingPractice: PracticeSlot | null,
  initialDate: string | undefined,
  initialStartTime: string | undefined,
  sports: Sport[]
): PracticeFormData {
  if (editingPractice) {
    return {
      sportId: editingPractice.sportId,
      date: editingPractice.date,
      startTime: editingPractice.startTime,
      endTime: editingPractice.endTime,
      location: editingPractice.location ?? "",
      notes: editingPractice.notes ?? "",
    };
  }

  const start = initialStartTime ?? "09:00";
  const [h] = start.split(":").map(Number);
  const endHour = Math.min(h + 1, 22);

  return {
    sportId: sports[0]?.id ?? "",
    date: initialDate ?? "",
    startTime: start,
    endTime: `${endHour.toString().padStart(2, "0")}:00`,
    location: "",
    notes: "",
  };
}

type PracticeModalFormProps = Omit<PracticeModalProps, "open"> & {
  formKey: string;
};

function PracticeModalForm({
  sports,
  editingPractice,
  initialDate,
  initialStartTime,
  onClose,
  onSave,
  onDelete,
  getOverlappingPractices,
}: PracticeModalFormProps) {
  const [form, setForm] = useState(() =>
    buildInitialForm(editingPractice, initialDate, initialStartTime, sports)
  );
  const [error, setError] = useState<string | null>(null);

  const overlapWarning = (() => {
    if (!form.date || !form.startTime || !form.endTime) return null;
    const overlaps = getOverlappingPractices({
      id: editingPractice?.id,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
    });
    if (overlaps.length === 0) return null;
    return `This slot overlaps with ${overlaps.length} other practice${overlaps.length > 1 ? "s" : ""} on this day.`;
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = onSave(form, editingPractice?.id);
    if (err) {
      setError(err);
      return;
    }
    onClose();
  };

  const handleDelete = () => {
    if (!editingPractice || !onDelete) return;
    if (window.confirm("Delete this practice slot?")) {
      onDelete(editingPractice.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="practice-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        <h2 id="practice-modal-title" className="mb-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {editingPractice ? "Edit Practice" : "Add Practice"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="sport" className="mb-1 block text-xs font-medium text-zinc-500">
              Sport
            </label>
            <select
              id="sport"
              value={form.sportId}
              onChange={(e) => setForm((f) => ({ ...f, sportId: e.target.value }))}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800"
              required
            >
              <option value="" disabled>
                Select a sport
              </option>
              {sports.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="mb-1 block text-xs font-medium text-zinc-500">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="startTime" className="mb-1 block text-xs font-medium text-zinc-500">
                Start time
              </label>
              <input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="mb-1 block text-xs font-medium text-zinc-500">
                End time
              </label>
              <input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="mb-1 block text-xs font-medium text-zinc-500">
              Location <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. City Park court 2"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          <div>
            <label htmlFor="notes" className="mb-1 block text-xs font-medium text-zinc-500">
              Notes <span className="text-zinc-400">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Bring cleats"
              rows={2}
              className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500" role="alert">
              {error}
            </p>
          )}
          {overlapWarning && (
            <p className="text-xs text-amber-600 dark:text-amber-400" role="status">
              {overlapWarning}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            {editingPractice && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm font-medium text-red-500 transition hover:text-red-600"
              >
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PracticeModal({
  open,
  editingPractice,
  initialDate,
  initialStartTime,
  ...rest
}: PracticeModalProps) {
  if (!open) return null;

  const formKey =
    editingPractice?.id ?? `new-${initialDate ?? ""}-${initialStartTime ?? ""}`;

  return (
    <PracticeModalForm
      key={formKey}
      formKey={formKey}
      editingPractice={editingPractice}
      initialDate={initialDate}
      initialStartTime={initialStartTime}
      {...rest}
    />
  );
}
