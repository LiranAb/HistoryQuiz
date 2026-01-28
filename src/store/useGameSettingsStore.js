import { create } from "zustand";

export const useGameSettingsStore = create((set) => ({
  amount: 10,
  difficulty: "easy",
  type: "multiple",

  saveSettings: ({ amount, difficulty, type }) =>
    set({ amount, difficulty, type }),
}));
