import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  allUsers: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    getUsers: (state, action) => {
      state.allUsers = action.payload.users;
    },
  },
});

export const { setLogin, setLogout, getUsers } = authSlice.actions;
export default authSlice.reducer;
