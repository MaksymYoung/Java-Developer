import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    privateGroupPending: [],
};
const privateGroupPendingSlice = createSlice({
    name: "privateGroupPending",
    initialState,
    reducers: {
        membersPending: (state, action) => {
            return {
                ...state,
                privateGroupPending: action.payload
            }
        },

        filterPendingRequest: (state, action) => {
            const memberId = action.payload;
            state.privateGroupPending = state.privateGroupPending.filter((item) => {
                return item.joinId !== memberId;
            })
        },

        clearPrivateGroupPending: (state) => {
            state.privateGroupPending = [];
        },
    }
})

export const { membersPending, filterPendingRequest, clearPrivateGroupPending } = privateGroupPendingSlice.actions;

export default privateGroupPendingSlice.reducer;