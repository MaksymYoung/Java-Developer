import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken.js";

const initialState = {
    userPostsList: [],
    hasMore: true,
    index: 0,
    status: 'idle',
    error: null,
};

export const fetchFirstUserPosts = createAsyncThunk(
    'userPosts/fetchFirstUserPosts',
    async () => {
        // const userId = localStorage.getItem('userId');
        const userId = getUserIdFromToken();
        const response = await axiosInstance.get(`/api/v1/feeds/users/${userId}?page=0&size=10`);
        return response.data.content;
    }
);

export const fetchMoreUserPosts = createAsyncThunk(
    'userPosts/fetchMoreUserPosts',
    async (index) => {
        // const userId = localStorage.getItem('userId');
        const userId = getUserIdFromToken();
        const response = await axiosInstance.get(`/api/v1/feeds/users/${userId}?page=${index}&size=10`);
        return response.data.content;
    }
);

export const createUserPost = createAsyncThunk(
    "userPosts/createUserPost",
    async ({ userId, postText, files }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("text", postText);
            if (files){
                for (let file of files) {
                    formData.append("file", file);
                }
            }
            const res = await axiosInstance.post(
                `/api/v1/feeds/users/${userId}/feeds`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            if (!res.data) {
                throw new Error("Failed to send postData");
            }

            return res.data;
        } catch (error) {
            console.error("Error create:", error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const deleteUserPost = createAsyncThunk(
    'userPosts/deleteUserPost',
    async (postId) => {
        const response = await axiosInstance.delete(`/api/v1/feeds/${postId}`);
        return response.data.content;
    }
);

const userPostSlice = createSlice({
    name: "userPosts",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFirstUserPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFirstUserPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userPostsList = action.payload;
                state.hasMore = action.payload.length > 0;
                state.index = 1;
            })
            .addCase(fetchFirstUserPosts.rejected, (state, {payload}) => {
                state.status = 'failed';
                console.log("Action 'fetch first user posts' has been REJECTED", payload)
            })
            .addCase(fetchMoreUserPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMoreUserPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userPostsList = [...state.userPostsList, ...action.payload];
                state.hasMore = action.payload.length > 0;
                state.index += 1;
            })
            .addCase(fetchMoreUserPosts.rejected, (state, {payload}) => {
                state.status = 'failed';
                console.log("Action 'fetch more user posts' has been REJECTED", payload);
            })
            .addCase(createUserPost.fulfilled, (state, { payload }) => {
                state.userPostsList.unshift(payload);
                //console.log("User post had been created", payload)
            })
            .addCase(deleteUserPost.fulfilled, (state, { meta }) => {
                state.userPostsList = state.userPostsList.filter(post => post.id !== meta.arg);
            })
            .addCase(createUserPost.rejected, (state, { payload }) => {
                console.log("Action 'create user post' has been REJECTED", payload)
            })
    },
})

export default userPostSlice.reducer;
