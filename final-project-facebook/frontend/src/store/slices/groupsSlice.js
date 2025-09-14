import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";
import { jwtDecode } from "jwt-decode";

const initialState = {
    user: '',
    userId: '',
    groups: [],
    createdGroup: {},
    searchGroups: [],
    userGroups: [],
    ownGroups: [],
    index: 1,
    hasMore: true,
    status: "",
    errors: null,
    message: null,
    requests: [],
    group: {},
    joinRequest: [],
    pendingGroups: [],
};

export const fetchGroups = createAsyncThunk("groups/fetchGroups", async () => {
    try {
        const response = await axiosInstance.get(`/api/groups?pageNumber=0&size=10`);

        return response.data.data.groups;
    } catch (error) {
        console.log(error);
    }
});

export const fetchMoreGroups = createAsyncThunk(
    "groups/fetchMoreGroups",
    async (index, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/groups?pageNumber=${index}&size=12`
            );

            return response.data.data.groups;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserGroups = createAsyncThunk(
    "groups/fetchUserGroups",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/groups/member?pageNumber=0&size=10`
            );

            return response.data.data.groups;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchOwnGroups = createAsyncThunk(
    "groups/fetchOwnGroups",
    async ({ rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/groups/owned?pageNumber=0&size=10`
            );

            return response.data.data.groups;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createGroup = createAsyncThunk(
    "groups/createGroup",
    async (obj, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/groups`, obj);

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const leaveGroup = createAsyncThunk(
    "groups/leaveGroup",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/groups/${id}/leave`);
            const data = response.data;
            return { id, data };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteGroup = createAsyncThunk(
    "groups/deleteGroup",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/api/groups/${id}`);
            const data = response;
            return { id, data };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const joinGroup = createAsyncThunk(
    "groups/joinGroup",
    async ({ groupId, userId }, { getState, rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/groups/${groupId}/join`);

            const data = response.data;
            const state = getState().groups;
            const updatedGroups = state.groups.map((group) =>
                group.id === groupId
                    ? { ...group, members: [...group.members, userId] }
                    : group
            );
            const updatedUserGroups = updatedGroups.filter((group) =>
                group.members.includes(userId)
            );

            return {
                groupId,
                updatedGroups,
                updatedUserGroups,
                message: data.message,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const requestJoinPrivatGroup = createAsyncThunk(
    "groups/requestJoinPrivatGroup",
    async ({ groupId }) => {
        try {
            const response = await axiosInstance.post(`/api/groups/${groupId}/join`);
            const infoData = response.data;
            const data = { ...infoData, groupId: groupId };
            return data;
        } catch (error) {
            return console.error(error, "texted");
        }
    }
);


export const getRequestGroups = createAsyncThunk(
    "groups/getRequest",
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/groups/${groupId}/join-requests`
            );

            const data = await response.data;
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSearchGroups = createAsyncThunk(
    "groups/fetchSearchGroups",
    async (name, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/groups/search?name=${encodeURIComponent(name)}`
            );

            if (response.status === 200) {
                return response.data;
            }
            const data = await response.data;
            return data;
        } catch (error) {
            if (error.response.status === 404) {
                return error.response.data;
            }
            return rejectWithValue(error.message);
        }
    }
);

export const fetchGroupById = createAsyncThunk(
    "groups/fetchGroupById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/groups/${id}`);
            const data = await response.data;
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUpdateGroupById = createAsyncThunk("groups/fetchUpdateGroupById",
    async ({ groupData, groupId }) => {
        try {
            const response = await axiosInstance.put(`/api/groups/${groupId}`, groupData);
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            const data = await response.data.data
            return data;
        } catch (error) {
            console.error(error, "texted");
        }
    }
);

export const fetchImageGroup = createAsyncThunk(
    "groups/fetchImageGroup",
    async ({ id, formData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post(`/api/groups/${id}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;
            dispatch(fetchGroupById(id))
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchGetJoinRequest = createAsyncThunk(
    "groups/fetchGetJoinRequest",
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/groups/${groupId}/join-requests`);
            return response.data.data;
        } catch (error) {
            return console.log(error.message);
        }
    }
);

export const fetchRejectJoin = createAsyncThunk(
    "groups/fetchRejectJoin",
    async (requestId) => {
        try {
            const response = await axiosInstance.post(`/api/groups/join-requests/${requestId}/reject`);

            return response.data.data;
        } catch (error) {
            return console.log(error.message);
        }
    }
);

export const fetchApproveJoin = createAsyncThunk(
    "groups/fetchApproveJoin",
    async (requestId) => {
        try {
            const response = await axiosInstance.post(`/api/groups/join-requests/${requestId}/approve`);

            return response.data.data;
        } catch (error) {
            console.error(error, "texted");
        }
    }
);

export const getGroupJoinPending = createAsyncThunk(
    "groups/getGroupJoinPending",
    async () => {
        try {
            const response = await axiosInstance.get(`/api/groups/pending`);
            return response.data;
        } catch (error) {
            return console.log(error.message);
        }
    }
);

const groupSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        clearCreatedGroup: (state) => {
            state.createdGroup = {};
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.fulfilled, (state, { payload }) => {
                state.user = jwtDecode(localStorage.getItem("accessToken"));
                state.userId = jwtDecode(localStorage.getItem("accessToken"))?.userId;
                state.status = "success";
                state.groups = payload;
                state.index = 1;
                state.hasMore = true;
            })
            .addCase(fetchGroups.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'fetchGroups' has been REJECTED", payload);
            })
            .addCase(fetchGroups.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMoreGroups.fulfilled, (state, { payload }) => {
                state.groups = [...state.groups, ...payload];
                state.hasMore = payload.length > 0;
                state.index = state.index + 1;
            })
            .addCase(createGroup.fulfilled, (state, { payload }) => {
                state.status = "success";
                state.groups.push(payload);
                state.createdGroup = payload;
            })
            .addCase(createGroup.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'createGroup' has been REJECTED", payload);
            })
            .addCase(createGroup.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUserGroups.fulfilled, (state, { payload }) => {
                state.userGroups = payload;
            })
            .addCase(joinGroup.fulfilled, (state, { payload }) => {
                state.userId = jwtDecode(localStorage.getItem("accessToken"))?.userId;
                state.groups = payload.updatedGroups;
                state.userGroups = payload.updatedUserGroups;
                state.searchGroups = state.searchGroups.map((group) =>
                    group.id === payload.groupId
                        ? { ...group, members: [...group.members, state.userId] }
                        : group
                );
                state.message = payload.message;
                state.status = "success";
            })
            .addCase(joinGroup.rejected, (state, { payload }) => {
                state.status = "failed";
                state.groups = payload;
                console.log("Action 'join groups' has been REJECTED", payload);
            })
            .addCase(joinGroup.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getRequestGroups.fulfilled, (state, { payload }) => {
                state.requests.push(payload);
            })
            .addCase(fetchSearchGroups.fulfilled, (state, { payload }) => {
                state.status = "success";
                if (payload.status === "success") {
                    state.searchGroups = payload.data;
                } else if (payload.status === "error") {
                    state.message = payload.message;
                    state.searchGroups = [];
                }
            })
            .addCase(fetchSearchGroups.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'fetchSearchGroups' has been REJECTED", payload);
            })
            .addCase(fetchSearchGroups.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOwnGroups.fulfilled, (state, { payload }) => {
                state.status = "success";
                state.ownGroups = payload;
            })
            .addCase(fetchOwnGroups.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'fetchGroups' has been REJECTED", payload);
            })
            .addCase(fetchOwnGroups.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchGroupById.fulfilled, (state, { payload }) => {
                state.status = "success";
                state.group = payload;
            })
            .addCase(leaveGroup.fulfilled, (state, { payload }) => {
                if (payload.data.status === "success") {
                    state.userGroups = state.userGroups.filter(
                        (group) => group.id !== payload.id
                    );
                }
            })
            .addCase(leaveGroup.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'join groups' has been REJECTED", payload);
            })
            .addCase(leaveGroup.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteGroup.fulfilled, (state, { payload }) => {
                if (payload.data.status === 204) {
                    state.userGroups = state.userGroups.filter(
                        (group) => group.id !== payload.id
                    );
                    state.ownGroups = state.ownGroups.filter(
                        (group) => group.id !== payload.id
                    );
                }
            })
            .addCase(deleteGroup.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'join groups' has been REJECTED", payload);
            })
            .addCase(deleteGroup.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUpdateGroupById.fulfilled, (state, { payload }) => {
                state.status = "success";
                state.group = payload;
            })
            .addCase(fetchUpdateGroupById.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'fetchUpdateGroupById' has been REJECTED", payload);
            })
            .addCase(fetchUpdateGroupById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchGetJoinRequest.fulfilled, (state, { payload }) => {
                state.status = "pending";
                state.joinRequest;
                state.joinRequest = payload;
            })

            .addCase(fetchRejectJoin.fulfilled, (state, { payload }) => {
                state.status = "success";
                state.joinRequest;
                state.joinRequest = payload;
            })
            .addCase(fetchRejectJoin.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'fetchRejectJoin' has been REJECTED", payload);
            })
            .addCase(fetchRejectJoin.pending, (state) => {
                state.status = "loading";
            })

            .addCase(fetchApproveJoin.fulfilled, (state, { payload }) => {
                state.status = "success";
                state.joinRequest;
                state.joinRequest = payload;
            })
            .addCase(fetchApproveJoin.rejected, (state, { payload }) => {
                state.status = "failed";
                console.log("Action 'fetchApproveJoin' has been REJECTED", payload);
            })
            .addCase(fetchApproveJoin.pending, (state) => {
                state.status = "loading";
            })

            .addCase(requestJoinPrivatGroup.fulfilled, (state, { payload }) => {
                state.requests.push(payload);
            })

            .addCase(getGroupJoinPending.fulfilled, (state, { payload }) => {
                state.pendingGroups = payload;
            })

            .addCase(fetchImageGroup.fulfilled, (state, { payload }) => {
                console.log('fetchImageGroup payload', payload);
            })
    },
});

export const { clearCreatedGroup } = groupSlice.actions

export default groupSlice.reducer;