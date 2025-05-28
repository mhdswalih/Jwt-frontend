import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const adminLogin = createAsyncThunk(
    "login/adminLogin",
    async (adminData: { email: string; password: string }, { rejectWithValue }) => {  
      try {
        const response = await axios.post('http://localhost:4200/admin/admin-login',adminData) 
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );


interface LoginState {
  admin: any;
  accessToken: string | null;
  status: string;
  error: string | null;
}

const initialState: LoginState = {
  admin: null,
  accessToken: null,
  status: "",
  error: null,
};

const adminSlice = createSlice({
    name: "login",
  initialState,
  reducers: {
    
    logout: (state) => {
      state.admin = null;
      state.accessToken = null;
      state.status = "";
      state.error = null;
    },
    updateUser: (state, action) => {
      state.admin = {
        ...state.admin,
        ...action.payload,
      };
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload.data;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUser } = adminSlice.actions;
export default adminSlice.reducer;
