import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
    commentsList: [],
    hasMore: true,
    index: 0,
    status: 'idle',
    error: null,
};

const API = "/api/v1";

export const createComment = createAsyncThunk(
    "comment/createComment",
    async ({ feedId, userId, commentText }, {errorMessage}) => {
        try {
            const res = await axiosInstance.post(`${API}/comments`,
                {feedId: feedId, userId: userId, comment: commentText});

            if (!res.data) {
                throw new Error("Failed to create comment");
            }

            return res.data;
        } catch (error) {
            console.error("Error:", error);
            return errorMessage(error.message);
        }
    }
)

export const fetchAllCommentsFeed = createAsyncThunk(
    'comments/fetchAllCommentsFeed',
    async (feedId) => {
        const response = await axiosInstance.get(`${API}/comments/feed/${feedId}`);
        return response.data;
    }
);

export const fetchFirstComments = createAsyncThunk(
    'comments/fetchFirstComments',
    async () => {
        const response = await axiosInstance.get(`${API}/feeds/friends?page=0&size=10`);
        return response.data.content;
    }
);

export const fetchMoreComments = createAsyncThunk(
    'comments/fetchMoreComments',
    async (index) => {
        const response = await axiosInstance.get(`${API}/feeds/friends?page=${index}&size=10`);
        return response.data.content;
    }
);


export const deletePostComment = createAsyncThunk(
    'comments/deletePostComment',
    async (commentId) => {
        const response = await axiosInstance.delete(`${API}/comments/${commentId}`);
        return response.data.content;
    }
);

const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCommentsFeed.fulfilled, (state, action) => {
                state.commentsList = action.payload;
            })
            .addCase(fetchFirstComments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFirstComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.commentsList = action.payload;
                state.hasMore = action.payload.length > 0;
                state.index = 1;
            })
            .addCase(fetchFirstComments.rejected, (state, {payload}) => {
                state.status = 'failed';
                console.log("Action 'fetch first posts' has been REJECTED", payload)
            })
            .addCase(fetchMoreComments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMoreComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.commentsList = [...state.commentsList, ...action.payload];
                state.hasMore = action.payload.length > 0;
                state.index += 1;
            })
            .addCase(fetchMoreComments.rejected, (state, {payload}) => {
                state.status = 'failed';
                console.log("Action 'fetch comments posts' has been REJECTED", payload);
            })
            .addCase(createComment.fulfilled, (state, { payload }) => {
                state.commentsList.unshift(payload);
            })
            .addCase(createComment.rejected, (state, { payload }) => {
                console.log("Action 'create comments' has been REJECTED", payload)
            })
            .addCase(deletePostComment.fulfilled, (state,  { meta }) => {
                state.commentsList = state.commentsList.filter(post => post.id !== meta.arg);
            })
            .addCase(deletePostComment.rejected, (state, { payload }) => {
            console.log("Action 'delete comment' has been REJECTED", payload)
        })
    },
})

export default commentSlice.reducer;
