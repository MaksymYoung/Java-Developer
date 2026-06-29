import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance.js";

const initialState = {
  createdChatGroup: {},
  groupChats: [],
  messages: [],
  message: {},
  error: null,
};

const API = '/msg/chat/'

export const fetchGroupChats = createAsyncThunk(
  "chatGroups/fetchChatGroups",
  async (userId, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(`${API}${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessagesGroupChats = createAsyncThunk(
  "chatGroups/fetchMessagesGroupChats",
  async (id, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.get(`${API}messages/${id}`);
      
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createGroupChat = createAsyncThunk(
  "chatGroups/createGroupChat",
  async (name, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(`${API}create?name=${name}`)
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessageGroupChat = createAsyncThunk(
  "chatGroups/sendMessageGroupChat",
  async (obj, {rejectWithValue}) => {
    try {
      const res = await axiosInstance.post(`${API}message`, obj)
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteGroupChat = createAsyncThunk(
  "chatGroups/deleteGroupChat",
  async (id, {rejectWithValue}) => {
    try {
      await axiosInstance.delete(`${API}delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMemberGroupChat = createAsyncThunk(
  "chatGroups/addMemberGroupChat",
  async ({groupId: groupId, userId: userId}, {rejectWithValue}) => {
    try {
      await axiosInstance.post(`${API}addParticipant?groupId=${groupId}&userId=${userId}`);
      return {groupId, userId}
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeMemberGroupChat = createAsyncThunk(
  "chatGroups/removeMemberGroupChat",
  async ({groupId: groupId, userId: userId}, {rejectWithValue}) => {
    try {
      await axiosInstance.post(`${API}removeParticipant?groupId=${groupId}&userId=${userId}`);
      return {groupId, userId}
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const renameGroupChat = createAsyncThunk(
  "chatGroups/renameGroupChat",
  async ({groupId: groupId, name: name}, {rejectWithValue}) => {
    try {
      const newName = new URLSearchParams({
        'newName': name
      })
      const res = await axiosInstance.put(`${API}rename/${groupId}?${newName}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

const groupChatSlice = createSlice({
  name: "chatGroups",
  initialState,
  reducers: {
    addChatGroup: (state, {payload}) => {
      state.groupChats = [...state.groupChats, payload]
    },
    removeChatGroup: (state, {payload}) => {
      state.groupChats = state.groupChats.filter((group) => group.id !== payload)
    },
    renameChatGroup: (state, {payload}) => {
      state.groupChats = state.groupChats.map((group) => {
        if (group.id === payload.id) {
          return {...group, name: payload.name}
        }
        return group
      })
    },
    removeFromGroupChat: (state, {payload}) => {
      state.groupChats = state.groupChats.map((group) => {
        if (group.id == payload.groupId) {
          return {...group, participants: payload.participants}
        }
        return group
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupChats.fulfilled, (state, { payload }) => {
        state.groupChats = payload;
      })
      .addCase(createGroupChat.fulfilled, (state, { payload }) => {
        state.createdChatGroup = payload;
        state.groupChats.push(payload);
        state.messages = [];
      })
      .addCase(fetchMessagesGroupChats.fulfilled, (state, { payload }) => {
        state.messages = payload;
      })
      .addCase(fetchGroupChats.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(createGroupChat.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(fetchMessagesGroupChats.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(sendMessageGroupChat.fulfilled, (state, { payload }) => {
        state.message = payload;
        state.messages.push(payload);
      })
      .addCase(deleteGroupChat.fulfilled, (state, { payload }) => {
        state.groupChats = state.groupChats.filter((item) => item.id !== payload);
      })
      .addCase(removeMemberGroupChat.fulfilled, (state, { payload }) => {
        state.groupChats = state.groupChats.map((group) => {
          if (group.id === payload.groupId) {
            return {...group, participants: group.participants.filter((item) => item !== payload.userId)}
          }
          return group;
        })
      })
      .addCase(renameGroupChat.fulfilled, (state, {payload}) => {
        state.groupChats = state.groupChats.map((group) => {
          if (group.id === payload.id) {
            return {...group, name: payload.name}
          }
          return group;
        })
      })
  },
});

export const { addChatGroup, removeFromGroupChat, removeChatGroup, renameChatGroup, clearGroupChats } = groupChatSlice.actions

export default groupChatSlice.reducer;
