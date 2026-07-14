import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  Attachment,
  Comment,
  ChecklistItem,
  Task,
  TaskLink,
  TaskStatus,
} from "@app/data/types";
import { SEED_TASKS } from "@app/data/seed";

const touch = (task: Task) => {
  task.updatedAt = new Date().toISOString();
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: SEED_TASKS,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      // push to the front of its column
      state.forEach((task) => {
        if (task.status === action.payload.status) task.order += 1;
      });
      state.unshift({ ...action.payload, order: 0 });
    },

    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const task = state.find((item) => item.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload);
        touch(task);
      }
    },

    removeTask: (state, action: PayloadAction<string>) => {
      return state.filter((task) => task.id !== action.payload);
    },

    /** Move a task to `toStatus` at position `toIndex` (drag & drop). */
    moveTask: (
      state,
      action: PayloadAction<{ id: string; toStatus: TaskStatus; toIndex: number }>,
    ) => {
      const { id, toStatus, toIndex } = action.payload;
      const moving = state.find((task) => task.id === id);
      if (!moving) return;

      const fromStatus = moving.status;
      moving.status = toStatus;
      touch(moving);

      const dest = state
        .filter((task) => task.status === toStatus && task.id !== id)
        .sort((a, b) => a.order - b.order);

      const clampedIndex = Math.max(0, Math.min(toIndex, dest.length));
      dest.splice(clampedIndex, 0, moving);
      dest.forEach((task, index) => {
        task.order = index;
      });

      if (fromStatus !== toStatus) {
        state
          .filter((task) => task.status === fromStatus)
          .sort((a, b) => a.order - b.order)
          .forEach((task, index) => {
            task.order = index;
          });
      }
    },

    toggleCritical: (state, action: PayloadAction<string>) => {
      const task = state.find((item) => item.id === action.payload);
      if (task) {
        task.critical = !task.critical;
        touch(task);
      }
    },

    addComment: (
      state,
      action: PayloadAction<{ taskId: string; comment: Comment }>,
    ) => {
      const task = state.find((item) => item.id === action.payload.taskId);
      if (task) {
        task.comments.push(action.payload.comment);
        touch(task);
      }
    },

    addChecklistItem: (
      state,
      action: PayloadAction<{ taskId: string; item: ChecklistItem }>,
    ) => {
      const task = state.find((item) => item.id === action.payload.taskId);
      if (task) task.checklist.push(action.payload.item);
    },

    toggleChecklistItem: (
      state,
      action: PayloadAction<{ taskId: string; itemId: string }>,
    ) => {
      const task = state.find((item) => item.id === action.payload.taskId);
      const item = task?.checklist.find((c) => c.id === action.payload.itemId);
      if (item) item.done = !item.done;
    },

    removeChecklistItem: (
      state,
      action: PayloadAction<{ taskId: string; itemId: string }>,
    ) => {
      const task = state.find((item) => item.id === action.payload.taskId);
      if (task) task.checklist = task.checklist.filter((c) => c.id !== action.payload.itemId);
    },

    addLink: (state, action: PayloadAction<{ taskId: string; link: TaskLink }>) => {
      const task = state.find((item) => item.id === action.payload.taskId);
      if (task) task.links.push(action.payload.link);
    },

    removeLink: (
      state,
      action: PayloadAction<{ taskId: string; linkId: string }>,
    ) => {
      const task = state.find((item) => item.id === action.payload.taskId);
      if (task) task.links = task.links.filter((l) => l.id !== action.payload.linkId);
    },

    addAttachment: (
      state,
      action: PayloadAction<{ taskId: string; attachment: Attachment }>,
    ) => {
      const task = state.find((item) => item.id === action.payload.taskId);
      if (task) task.attachments.push(action.payload.attachment);
    },

    removeAttachment: (
      state,
      action: PayloadAction<{ taskId: string; attachmentId: string }>,
    ) => {
      const task = state.find((item) => item.id === action.payload.taskId);
      if (task) {
        task.attachments = task.attachments.filter(
          (a) => a.id !== action.payload.attachmentId,
        );
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  removeTask,
  moveTask,
  toggleCritical,
  addComment,
  addChecklistItem,
  toggleChecklistItem,
  removeChecklistItem,
  addLink,
  removeLink,
  addAttachment,
  removeAttachment,
} = tasksSlice.actions;
export default tasksSlice.reducer;
