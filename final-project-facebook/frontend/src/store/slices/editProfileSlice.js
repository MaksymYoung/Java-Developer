import { createSlice } from "@reduxjs/toolkit";

const editProfileSlice = createSlice({
  name: "editProfile",
  initialState: {
    isEditVisible: {},
    formikProps: null,
  },
  reducers: {
    setIsEditVisible(state, { payload }) {
      const { field, isVisible } = payload;
      state.isEditVisible[field] = isVisible;
    },
    setFormikProps(state, { payload }) {
      state.formikProps = payload;
    },
  },
});

export default editProfileSlice.reducer;
export const { setIsEditVisible, setFormikProps } = editProfileSlice.actions;
