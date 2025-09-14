import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
    postsList: [],
    hasMore: true,
    index: 0,
    status: 'idle',
    error: null,
};

const API = "/api/v1";

export const fetchFirstFeedPosts = createAsyncThunk(
    'feed/fetchFirstFeedPosts',
    async () => {
        const response = await axiosInstance.get(`${API}/feeds/friends?page=0&size=10`);
        return response.data.content;
    }
);

export const fetchMoreFeedPosts = createAsyncThunk(
    'feed/fetchMoreFeedPosts',
    async (index) => {
        const response = await axiosInstance.get(`${API}/feeds/friends?page=${index}&size=10`);
        return response.data.content;
    }
);

export const createPost = createAsyncThunk(
    "feed/createPost",
    async ({ userId, postText, files }, {errorMessage}) => {
        try {
            const formData = new FormData();

            if (files) {
                for (let file of files) {
                    formData.append("file", file);
                }
            }

            if (!postText) {
                formData.append("text", " ");
            } else {
                formData.append("text", postText);
            }

            const res = await axiosInstancePost.post(
                `${API}/feeds/users/${userId}/feeds`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });

            if (!res.data) {
                throw new Error("Failed to send postData");
            }

            return res.data;
        } catch (error) {
            console.error("Error:", error);
            return errorMessage(error.message);
        }
    }
)

export const deleteFeedPost = createAsyncThunk(
    'feed/deleteFeedPost',
    async (postId) => {
        const response = await axiosInstance.delete(`${API}/feeds/${postId}`);
        return response.data.content;
    }
);

const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFirstFeedPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFirstFeedPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.postsList = action.payload;
                state.hasMore = action.payload.length > 0;
                state.index = 1;
            })
            .addCase(fetchFirstFeedPosts.rejected, (state, {payload}) => {
                state.status = 'failed';
                console.log("Action 'fetch first posts' has been REJECTED", payload)
            })
            .addCase(fetchMoreFeedPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMoreFeedPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.postsList = [...state.postsList, ...action.payload];
                state.hasMore = action.payload.length > 0;
                state.index += 1;
            })
            .addCase(fetchMoreFeedPosts.rejected, (state, {payload}) => {
                state.status = 'failed';
                console.log("Action 'fetch more posts' has been REJECTED", payload);
            })
            .addCase(createPost.fulfilled, (state, { payload }) => {
                console.log("Post had been created", payload)
            })
            .addCase(createPost.rejected, (state, { payload }) => {
                console.log("Action 'create post' has been REJECTED", payload)
            })
            .addCase(deleteFeedPost.fulfilled, (state, { meta }) => {
                state.postsList = state.postsList.filter(post => post.id !== meta.arg);
            })
            .addCase(deleteFeedPost.rejected, (stste, {payload}) => {
                console.log("Action 'delete post' has been REJECTED", payload)
            })
    },
})

export default feedSlice.reducer;
