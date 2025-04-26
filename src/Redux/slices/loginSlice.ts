import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginState {
  user: any;
  accessToken: string | null;
  status: string;
  error: string | null;
}

const initialState: LoginState = {
  user: null,
  accessToken: null,
  status: "",
  error: null,
};


export const userLogin = createAsyncThunk(
  "login/userLogin",
  async (userData: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:4200/login-user", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userEdit = createAsyncThunk(
  'edit/userEdit',
  async (
    userData: { id: string; name: string; image: string },
    { rejectWithValue }
  ) => {
    console.log(userData,'this is userdata');
    
    try {
      const response = await axios.put(
        `http://localhost:4200/edit-user/${userData.id}`,
        { name: userData.name, image: userData.image }
      );
      console.log(response.data,'this is responseData');
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);



const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "";
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUser } = loginSlice.actions;
export default loginSlice.reducer;
