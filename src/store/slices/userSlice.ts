import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/utils/types';

interface UserState {
  current: User | null;
}

const initialState: UserState = {
  current: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.current = action.payload;
    },
    logout(state) {
      state.current = null;
    },
  },
});

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;
