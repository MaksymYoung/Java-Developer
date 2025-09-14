import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
const URL_SIGNUP = `/api/v1/users/`;

export const actionGetDataAuthUser = createAsyncThunk(
  "editThunk/getUserAuth",
  async ({ userId }) => {
    try {
      const responseAuth = await axiosInstance.get(`${URL_SIGNUP}${userId}`);
      const dataAuth = await responseAuth.data;

      const mutationDataAuth = dataAuth.birthDate;
      const [year, month, day] = mutationDataAuth
        ? mutationDataAuth.split("-")
        : ["", "", ""];

      const authData = {
        ...dataAuth,
        day,
        month,
        year,
      };

      return authData;
    } catch (error) {
      console.error(
        "Something with GET in GET-Axios Auth had gone wrong!!!",
        error
      );
      throw error;
    }
  }
);

export const actionGetDataEditProfile = createAsyncThunk(
  "editThunk/getDataEditProfile",
  async ({ userId }) => {
    try {
      const responseEditProfile = await axiosInstance.get(
        `/api/v1/userprofile/id/${userId}`
      );
      const dataEdit = responseEditProfile.data.data;

      return dataEdit;
    } catch (error) {
      console.error("Something with GET in GET-Axios had gone wrong!!!", error);
      throw error;
    }
  }
);

export const actionPutUserThunk = createAsyncThunk(
  "editThunk/updateUser",
  async ({ userData, userId }) => {
    try {
      const responseSignUp = await axiosInstance.put(
        `${URL_SIGNUP}id/${userId}`,
        userData
      );

      const responseEditProfile = await axiosInstance.put(
        `/api/v1/userprofile/updating`,
        userData
      );

      const dataSignUp = responseSignUp.data;
      const dataEditProfile = responseEditProfile.data.data;

      return {
        dataEditProfile,
        dataSignUp,
      };
    } catch (error) {
      console.error("Something in PUT-Axios had gone wrong", error);
      console.error("Error Status: ", error.status);
      throw error;
    }
  }
);

const initialState = {
  authData: {},
  editData: {},
  error: null,
  loading: false,
};

const editThunkSlice = createSlice({
  name: "editThunk",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(actionGetDataAuthUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetDataAuthUser.fulfilled, (state, { payload }) => {
        state.authData = payload;
        state.loading = false;
      })
      .addCase(actionGetDataAuthUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(actionGetDataEditProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(actionGetDataEditProfile.fulfilled, (state, { payload }) => {
        state.editData = payload;
        state.loading = false;
      })
      .addCase(actionGetDataEditProfile.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default editThunkSlice.reducer;
