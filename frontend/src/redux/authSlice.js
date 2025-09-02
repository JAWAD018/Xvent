import { createSlice } from "@reduxjs/toolkit";
// import SuggestedUsers from "../components/SuggestedUsers";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    SuggestedUsers:[]
  },
  reducers: {
    // actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers:(state,action)=>{
      state.SuggestedUsers = action.payload;
    }
  },
});

export const { setAuthUser, setSuggestedUsers} = authSlice.actions;
export default authSlice.reducer;
