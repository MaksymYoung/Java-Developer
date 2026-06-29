import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";

const initialState = {
    friendStatus: "not_friends", // "not_friends", "request_sent", "friends"
    allSentRequests: [],
    allPendingSentRequests: [],
    allPendingReceivedRequests: [],
    allFriends: [],
};


// Async thunk for check, if current user and other user are friends
export const friendRequestAreFriends = createAsyncThunk(
    "friend/requestAreFriend",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/friend-requests/are-friends?userId=${userData.userId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for get all sent requests regardless of status
export const allSentRequests = createAsyncThunk(
    "friend/allSentRequests",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/friend-requests/sent`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for get all received requests from other users to current user in status PENDING
export const allReceivedPendingRequests = createAsyncThunk(
    "friend/allReceivedPendingRequests",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/friend-requests/pending`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for get all friends of current user
export const allFriends = createAsyncThunk(
    "friend/allFriends",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/friend-requests/friends`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for friend request send from current user to other user by id of receivedId
export const friendRequestSend = createAsyncThunk(
    "friend/requestSend",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/friend-requests/send?receiverId=${userData.receiverId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for friend request revoke from current user to other user
export const friendRequestRevoke = createAsyncThunk(
    "friend/requestRevoke",
    async (userData, { rejectWithValue }) => {
        try {
            // console.log("REVOKE userData", userData)
            const response = await axiosInstance.delete(`/friend-requests/revoke?receiverId=${userData.id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for Aprove received friend request from other person by id of request
export const friendRequestAprove = createAsyncThunk(
    "friend/requestAprove",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/friend-requests/approve?requestId=${userData.id}`);            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for Reject received friend request from other person by id of request
export const friendRequestReject = createAsyncThunk(
    "friend/requestReject",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/friend-requests/reject?requestId=${userData.id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for Remove friend from friends by id of friend
export const friendRequestRemove = createAsyncThunk(
    "friend/requestRemove",
    async (userData, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/friend-requests/remove?friendId=${userData.id}`);
            return userData.id;  // Повертаємо ID видаленого друга
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const friendSlice = createSlice({
    name: "friend",
    initialState,

    reducers: {
        setFriendStatus: (state, action) => {
            state.friendStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(friendRequestAreFriends.fulfilled, (state, action) => {
                state.friendStatus = action.payload ? "friends" : "not_friends";
            })
            .addCase(friendRequestAreFriends.rejected, (state, action) => {
                console.error("request are friend failed", action.payload);
            })
            .addCase(allSentRequests.fulfilled, (state, action) => {
                state.allSentRequests = action.payload;
                state.allPendingSentRequests = action.payload.filter(request => request.status === "PENDING");
            })
            .addCase(allSentRequests.rejected, (state, action) => {
                console.error("request all sent requests failed", action.payload);
            })
            .addCase(allReceivedPendingRequests.fulfilled, (state, action) => {
                state.allPendingReceivedRequests = action.payload;
            })
            .addCase(allReceivedPendingRequests.rejected, (state, action) => {
                console.error("request all received requests failed", action.payload);
            })
            .addCase(allFriends.fulfilled, (state, action) => {
                state.allFriends = action.payload;
            })
            .addCase(allFriends.rejected, (state, action) => {
                console.error("request all friends failed", action.payload);
            })
            .addCase(friendRequestSend.fulfilled, (state, action) => {
                state.friendStatus = "request_sent";
            })
            .addCase(friendRequestSend.rejected, (state, action) => {
                console.error("friend Request Send failed:", action.payload);
            })
            .addCase(friendRequestRevoke.fulfilled, (state, action) => {
                state.friendStatus = "not_friends";
                state.allSentRequests = state.allSentRequests.filter(request => request.receiverId !== action.payload.receiverId);
                state.allPendingSentRequests = state.allPendingSentRequests.filter(request => request.receiverId !== action.payload.receiverId);
            })
            .addCase(friendRequestRevoke.rejected, (state, action) => {
                console.error("friend Request Revoke failed:", action.payload);
            })
            .addCase(friendRequestAprove.fulfilled, (state, action) => {
                state.friendStatus = "friends";
                state.allPendingReceivedRequests = state.allPendingReceivedRequests.filter(request => request.receiverId !== action.payload.receiverId);
            })
            .addCase(friendRequestAprove.rejected, (state, action) => {
                console.error("friend Request Aprove failed:", action.payload);
            })
            .addCase(friendRequestReject.fulfilled, (state, action) => {
                state.friendStatus = "not_friends";
                state.allPendingReceivedRequests = state.allPendingReceivedRequests.filter(request => request.receiverId !== action.payload.receiverId);
            })
            .addCase(friendRequestReject.rejected, (state, action) => {
                console.error("friend Request Reject failed:", action.payload);
            })
            .addCase(friendRequestRemove.fulfilled, (state, action) => {
                state.friendStatus = "not_friends";
                state.allFriends = state.allFriends.filter(friendId => friendId !== action.payload);
            })
            .addCase(friendRequestRemove.rejected, (state, action) => {
                console.error("friend Request Remove failed:", action.payload);
            })
    }
});

export const { setFriendStatus } = friendSlice.actions;

export default friendSlice.reducer;
