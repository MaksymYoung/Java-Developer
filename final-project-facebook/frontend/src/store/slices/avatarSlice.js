import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import handleErrorThunk from "./handleErrorThunk.js";

export const actionGetAvatar = createAsyncThunk(
  "avatarThunk/avatarDownload",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const responseAvatar = await axiosInstance.get(
        `/api/v1/userprofile/${userId}/getting/avatar-image`
      );

      const dataAvatar = responseAvatar.data.data;

      return dataAvatar;
    } catch (error) {
      handleErrorThunk(error, rejectWithValue);
    }
  }
);

export const actionGetAllAvatars = createAsyncThunk(
  "avatarThunk/avatarsAllDownload",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const responseAvatar = await axiosInstance.get(
        `/api/v1/userprofile/${userId}/getting/avatar-image`
      );

      const dataAvatar = responseAvatar.data.data;

      return dataAvatar;
    } catch (error) {
      handleErrorThunk(error, rejectWithValue);
    }
  }
);

export const actionPostAvatar = createAsyncThunk(
  "avatarThunk/avatarUpload",
  async ({ formData, imageNameLog }) => {
    try {
      const responseAvatar = await axiosInstance.post(
        `/api/v1/userprofile/uploading/avatar-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const dataPostAvatar = responseAvatar.data.message;
      return dataPostAvatar;
    } catch (error) {
      console.error("Cannot download avatar because axios error", error);

      if (error.response) {
        console.error("Error Status Code: ", error.response.status);
        console.error("Error Response Data: ", error.response.data);
      } else if (error.request) {
        console.error("No response received from server", error.request);
      } else {
        console.error("Error in setting up request", error.message);
      }
    }
  }
);

const initialState = {
  pathAvatar: "",
  avatars: {},
};

const avatarSlice = createSlice({
  name: "avatar",
  initialState,
  reducers: {
    clearAvatar: (state) => {
      state.pathAvatar = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actionGetAvatar.fulfilled, (state, { payload }) => {
        state.pathAvatar = payload;
      })
      .addCase(actionGetAvatar.rejected, (state, { payload }) => {
        if (payload === "") {
          state.pathAvatar = "";
        }
      })
      .addCase(actionPostAvatar.fulfilled, (state, { payload }) => {
        state.pathAvatar = payload;
      })
      .addCase(actionGetAllAvatars.fulfilled, (state, { meta, payload }) => {
        const { userId } = meta.arg;
        state.avatars[userId] = payload;
      })
      .addCase(actionGetAllAvatars.rejected, (state, { meta }) => {
        const { userId } = meta.arg;
        state.avatars[userId] = "";
      });
  },
});

export default avatarSlice.reducer;
export const { clearAvatar } = avatarSlice.actions;
