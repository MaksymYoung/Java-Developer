import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js";
import editProfileReducer from "./slices/editProfileSlice.js";
import editThunkReducer from "./slices/editThunkSlice.js";
import feedReducer from "./slices/feedPostsSlice.js";
import groupsReducer from "./slices/groupsSlice.js";
import commentsReducer from "./slices/commentSlice.js";
import groupChatReducer from "./slices/groupChatsSlice.js";
import friendReducer from "./slices/friendSlice.js";
import avatarReducer from "./slices/avatarSlice.js";
import coverPhotoReducer from "./slices/coverPhotoSlice.js";
import groupsPostsReducer from "./slices/groupFeedSlice.js"
import userPostsReducer from "./slices/userPostSlice.js"
import inviteToGroupReducer from "./slices/inviteFriendToGroup.js"
import privateGroupPendingReducer from "./slices/privateGroupPendingSlice.js"
const store = configureStore({
  reducer: {
    user: userReducer,
    userPosts: userPostsReducer,
    editProfile: editProfileReducer,
    editThunk: editThunkReducer,
    comments: commentsReducer,
    feed: feedReducer,
    groups: groupsReducer,
    groupChats: groupChatReducer,
    groupsPosts: groupsPostsReducer,
    friend: friendReducer,
    avatar: avatarReducer,
    coverPhoto: coverPhotoReducer,
    inviteFriend: inviteToGroupReducer,
    privateGroupPending: privateGroupPendingReducer,
  },
});
export default store;
