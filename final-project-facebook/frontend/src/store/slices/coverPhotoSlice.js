import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import handleErrorThunk from "./handleErrorThunk.js";

export const actionGetCover = createAsyncThunk(
  "coverThunk/coverDownload",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const responseCover = await axiosInstance.get(
        `/api/v1/userprofile/${userId}/getting/cover-image`
      );
      const dataCover = responseCover.data.data;

      return dataCover;
    } catch (error) {
      handleErrorThunk(error, rejectWithValue);
    }
  }
);

export const actionPostCover = createAsyncThunk(
  "coverThunk/coverUpload",
  async ({ formData, imageNameLog }) => {
    try {
      const responseCover = await axiosInstance.post(
        `/api/v1/userprofile/uploading/cover-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const dataPostCover = responseCover.data.message;
      return dataPostCover;
    } catch (error) {
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
  pathCover: "",
};

const coverPhotoSlice = createSlice({
  name: "coverPhoto",
  initialState,
  reducers: {
    clearCover: (state) => {
      state.pathCover = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actionGetCover.fulfilled, (state, { payload }) => {
      state.pathCover = payload;
    });
    builder
      .addCase(actionGetCover.rejected, (state, { payload }) => {
        if (payload === "") {
          state.pathCover = "";
        }
      })
      .addCase(actionPostCover.fulfilled, (state, { payload }) => {
        state.pathCover = payload;
      });
  },
});

export const { clearCover } = coverPhotoSlice.actions;

export default coverPhotoSlice.reducer;
