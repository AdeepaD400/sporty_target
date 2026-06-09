"use client";

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { PracticeModal } from "@/components/PracticeModal";
import { SportsPanel } from "@/components/SportsPanel";
import { WeekCalendar } from "@/components/WeekCalendar";
import { usePracticeStore } from "@/hooks/usePracticeStore";
import type { PracticeFormData, PracticeSlot } from "@/lib/types";

export function Dashboard() {
  const store = usePracticeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState<PracticeSlot | null>(null);
  const [initialDate, setInitialDate] = useState<string>("");
  const [initialStartTime, setInitialStartTime] = useState<string>("");

  const openAddModal = (date: string, startTime: string) => {
    if (store.sports.length === 0) return;
    setEditingPractice(null);
    setInitialDate(date);
    setInitialStartTime(startTime);
    setModalOpen(true);
  };

  const openEditModal = (practice: PracticeSlot) => {
    setEditingPractice(practice);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPractice(null);
  };

  const handleSave = (form: PracticeFormData, id?: string): string | null => {
    if (id) return store.updatePractice(id, form);
    return store.addPractice(form);
  };

  if (!store.hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:gap-6">
        <SportsPanel
          sports={store.sports}
          onAdd={store.addSport}
          onUpdate={store.updateSport}
          onDelete={store.deleteSport}
          getPracticeCount={store.getSportPracticeCount}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {store.sports.length === 0 ? (
            <EmptyState />
          ) : (
            <WeekCalendar
              sports={store.sports}
              practices={store.practices}
              onAddClick={openAddModal}
              onEditClick={openEditModal}
            />
          )}
        </div>
      </div>

      <PracticeModal
        open={modalOpen}
        sports={store.sports}
        editingPractice={editingPractice}
        initialDate={initialDate}
        initialStartTime={initialStartTime}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={store.deletePractice}
        getOverlappingPractices={store.getOverlappingPractices}
      />
    </>
  );
}
