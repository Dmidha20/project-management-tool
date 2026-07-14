import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Member } from "@app/data/types";
import { SEED_MEMBERS } from "@app/data/seed";

const membersSlice = createSlice({
  name: "members",
  initialState: SEED_MEMBERS,
  reducers: {
    addMember: (state, action: PayloadAction<Member>) => {
      state.unshift(action.payload);
    },
    updateMember: (state, action: PayloadAction<Member>) => {
      const index = state.findIndex((member) => member.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    removeMember: (state, action: PayloadAction<string>) => {
      return state.filter((member) => member.id !== action.payload);
    },
  },
});

export const { addMember, updateMember, removeMember } = membersSlice.actions;
export default membersSlice.reducer;
