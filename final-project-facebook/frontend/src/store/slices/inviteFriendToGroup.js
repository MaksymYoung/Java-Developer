import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    inviteToGroup: [],
};

const inviteToGroupSlice = createSlice({
    name: "inviteFriend",
    initialState,
    reducers: {
        addToInvitation: (state, action) => {
            const {friendId, firstName, lastName} = action.payload;
            state.inviteToGroup.push({friendId, firstName, lastName});
        },

        removeFromInvitation: (state, action) => {
            const friendId = action.payload;
                state.inviteToGroup = state.inviteToGroup.filter((item) => {
                    return item.friendId !== friendId;
                })
        },

        clearInvitationGroup: (state) => {
            state.inviteToGroup = [];
        },
    }
})

export const { addToInvitation, removeFromInvitation, clearInvitationGroup } = inviteToGroupSlice.actions;

export default inviteToGroupSlice.reducer;