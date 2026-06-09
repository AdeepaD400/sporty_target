export type Sport = {
  id: string;
  name: string;
  color: string;
};

export type PracticeSlot = {
  id: string;
  sportId: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
};

export type AppData = {
  sports: Sport[];
  practices: PracticeSlot[];
};

export type PracticeFormData = {
  sportId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string;
};
