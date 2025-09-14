import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken.js";

const initialState = {
    groupPostsList: [],
    hasMore: true,
    index: 0,
    status: 'idle',
    error: null,
};

export const fetchFirstGroupPosts = createAsyncThunk(
    'groupsPosts/fetchFirstGroupPosts',
    async ( groupId) => {
        const response = await axiosInstance.get(`/api/v1/feeds/group/${groupId}?page=0&size=10`);
        return response.data.content;
    }
);

export const fetchMoreGroupPosts = createAsyncThunk(
    'groupsPosts/fetchMoreGroupPosts',
    async ( groupId, index) => {
        const response = await axiosInstance.get(`/api/v1/feeds/group/${groupId}?page=${index}&size=10`);
        return response.data.content;
    }
);

export const createGroupPost = createAsyncThunk(
    "groupsPosts/groupsPosts",
    async ({ groupId, postText, files }, {errorMessage}) => {
        // const userId = localStorage.getItem("userId")
        const userId = getUserIdFromToken();
        try {
            const formData = new FormData();
            formData.append("text", postText);
            if (files){
                for (let file of files) {
                    formData.append("file", file);
                }
            }
            const res = await axiosInstance.post(
                `/api/v1/feeds/users/${userId}/group/${groupId}`,
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

export const deleteGroupPost = createAsyncThunk(
    'groupPosts/deleteGroupPost',
    async (postId) => {
        const response = await axiosInstance.delete(`/api/v1/feeds/${postId}`);
        return response.data.content;
    }
);

const groupsPostSlice = createSlice({
    name: "groupPosts",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFirstGroupPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFirstGroupPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.groupPostsList = action.payload;
                state.hasMore = action.payload.length > 0;
                state.index = 1;
            })
            .addCase(fetchFirstGroupPosts.rejected, (state, {payload}) => {
                state.status = 'failed';
                console.log("Action 'fetch first group posts' has been REJECTED", payload)
            })
            .addCase(fetchMoreGroupPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMoreGroupPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.postsList = [...state.groupPostsList, ...action.payload];
                state.hasMore = action.payload.length > 0;
                state.index += 1;
            })
            .addCase(fetchMoreGroupPosts.rejected, (state, {payload}) => {
                state.status = 'failed';
                console.log("Action 'fetch more group posts' has been REJECTED", payload);
            })
            .addCase(createGroupPost.fulfilled, (state, { payload }) => {
                state.groupPostsList.unshift(payload);
            })
            .addCase(deleteGroupPost.fulfilled, (state, { meta }) => {
                state.groupPostsList = state.groupPostsList.filter(post => post.id !== meta.arg);
            })
            .addCase(createGroupPost.rejected, (state, { payload }) => {
                console.log("Action 'create group post' has been REJECTED", payload)
            })
    },
})

export default groupsPostSlice.reducer;
