import { configureStore, combineReducers } from "@reduxjs/toolkit";

import members from "./slices/members-slice";
import projects from "./slices/projects-slice";
import tasks from "./slices/tasks-slice";
import notifications from "./slices/notifications-slice";

const rootReducer = combineReducers({ members, projects, tasks, notifications });

export type RootState = ReturnType<typeof rootReducer>;

const STORAGE_KEY = "pmt_demo_state_v1";

const loadState = (): Partial<RootState> | undefined => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<RootState>) : undefined;
  } catch {
    return undefined;
  }
};

const saveState = (state: RootState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write errors (e.g. private mode / quota)
  }
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(),
});

let saveTimer: ReturnType<typeof setTimeout> | undefined;
store.subscribe(() => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveState(store.getState()), 200);
});

/** Wipe persisted demo data and reload with the original seed. */
export const resetDemoData = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};

export type AppDispatch = typeof store.dispatch;
