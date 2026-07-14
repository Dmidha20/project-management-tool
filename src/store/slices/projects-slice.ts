import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Project, Section } from "@app/data/types";
import { SEED_PROJECTS } from "@app/data/seed";

const projectsSlice = createSlice({
  name: "projects",
  initialState: SEED_PROJECTS,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.unshift(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.findIndex((project) => project.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    removeProject: (state, action: PayloadAction<string>) => {
      return state.filter((project) => project.id !== action.payload);
    },
    setProjectMembers: (
      state,
      action: PayloadAction<{ projectId: string; memberIds: string[] }>,
    ) => {
      const project = state.find((item) => item.id === action.payload.projectId);
      if (project) project.memberIds = action.payload.memberIds;
    },
    addSection: (
      state,
      action: PayloadAction<{ projectId: string; section: Section }>,
    ) => {
      const project = state.find((item) => item.id === action.payload.projectId);
      if (project) project.sections.push(action.payload.section);
    },
  },
});

export const {
  addProject,
  updateProject,
  removeProject,
  setProjectMembers,
  addSection,
} = projectsSlice.actions;
export default projectsSlice.reducer;
