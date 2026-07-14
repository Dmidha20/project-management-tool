import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AppNotification } from "@app/data/types";

const initialState: AppNotification[] = [
  {
    id: "n-seed-1",
    message: "David Kim assigned “Foundation pile cap layout” to Priya Patel",
    taskId: "t4",
    createdAt: new Date(Date.parse("2026-07-13T15:20:00.000Z")).toISOString(),
    read: false,
  },
  {
    id: "n-seed-2",
    message: "Sofia Rossi returned “Ward wing closeout” for rework",
    taskId: "t12",
    createdAt: new Date(Date.parse("2026-07-13T09:05:00.000Z")).toISOString(),
    read: false,
  },
];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<AppNotification>) => {
      state.unshift(action.payload);
    },
    markAllRead: (state) => {
      state.forEach((item) => {
        item.read = true;
      });
    },
    clearNotifications: () => [],
  },
});

export const { pushNotification, markAllRead, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
