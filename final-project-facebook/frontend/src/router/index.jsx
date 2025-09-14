import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import LoginPage from "../pages/LoginPage/LoginPage.jsx";
import ForgotPasswordPage from "../pages/LoginPage/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/LoginPage/ResetPasswordPage.jsx";
import GroupsPage from "../pages/GroupPages/GroupsPage/GroupsPage.jsx";
import GroupDiscover from "../components/GroupsComponents/GroupDiscover/GroupDiscover.jsx";
import CreateGroupPage from "../pages/GroupPages/CreateGroupPage/CreateGroupPage.jsx";
import SearchGroupPage from "../pages/GroupPages/SearchGroupsPage/SearchGroupPage.jsx";
import ChatsPage from "../pages/ChatsPage/ChatsPage";
import GroupPage from "../pages/GroupPages/GroupPage/GroupPage.jsx";
import YourGroups from "../components/GroupsComponents/YourGroups/YourGroups.jsx";
import ManageGroupPage from "../pages/ManageGroup/ManageGroupPage";
import FriendsPage from "../pages/FriendsPage/FriendsPage.jsx";
import FriendsList from "../components/FriendsComponents/FriendsList.jsx";
import FriendsListPendingReceived from "../components/FriendsComponents/FriendsListPending_Received.jsx";
import FriendsListPendingSent from "../components/FriendsComponents/FriendsListPending_Sent.jsx";
import SearchList from "../components/FriendsComponents/SearchList.jsx";
import Mistake from "../pages/Mistake/Mistake.jsx";
import UnderConstruction from "../pages/UnderConstruction/UnderConstruction.jsx";
import ProfilePageFriend from "../pages/ProfilePageFriend/ProfilePageFriend.jsx";
import GroupChats from "../pages/ChatsPage/components/GroupChats.jsx";
import CreateChat from "../pages/ChatsPage/components/CreateChat.jsx";
import ProfilePage from "../pages/ProfilePage/ProfilePage.jsx";
import EditProfilePage from "../pages/EditProfilePage/EditProfilePage.jsx";
import UserPostsComponent from "../components/FeedNews/UserPosts/UserPostsComponent";
import HaveNotChats from "../pages/ChatsPage/components/HaveNotChats.jsx";

const RootRouter = () => {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/*" element={<Mistake />} />
      <Route path="/marketplace" element={<UnderConstruction />} />
      <Route path="/video" element={<UnderConstruction />} />
      <Route path="/menu" element={<UnderConstruction />} />
      <Route path="/notification" element={<UnderConstruction />} />
      <Route path="/videos" element={<UnderConstruction />} />
      <Route path="/memories" element={<UnderConstruction />} />
      <Route path="/saved" element={<UnderConstruction />} />
      <Route path="/ads-manager" element={<UnderConstruction />} />
      <Route path="/events" element={<UnderConstruction />} />
      <Route path="/marketplace" element={<UnderConstruction />} />

      {/* PUBLIC ROUTES */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* PRIVATE ROUTES */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route path="/profile" element={<PrivateRoute><Navigate to="/profile/posts" /></PrivateRoute>} />
      <Route path={"/profile"} element={<PrivateRoute><ProfilePage /></PrivateRoute>}>
        <Route path="posts" element={<UserPostsComponent />} />
        <Route path="friends" element={<FriendsList />} />
        <Route path="about" element={<EditProfilePage />} />
        <Route path="groups" element={<YourGroups />} />
        <Route path="photos" element={<UnderConstruction />} />
        <Route path="videos" element={<UnderConstruction />} />
        <Route path="more" element={<UnderConstruction />} />
      </Route>
      <Route
        path="/profile-edit"
        element={
          <PrivateRoute>
            <EditProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <PrivateRoute>
            <GroupsPage />
          </PrivateRoute>
        }
      >
        <Route path="feed" element={<h1>Hello feed</h1>} />
        <Route path="discover" element={<GroupDiscover />} />
        <Route path="your-groups" element={<YourGroups />} />
        <Route path=":id" element={<GroupPage />} />
      </Route>
      <Route
        path="/groups/:id/manage-group"
        element={
          <PrivateRoute>
            <ManageGroupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups/create"
        element={
          <PrivateRoute>
            <CreateGroupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups/search"
        element={
          <PrivateRoute>
            <SearchGroupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <ChatsPage />
          </PrivateRoute>
        }
      >
        <Route path="/messages/:id" element={<GroupChats />} />
        <Route path="new" element={<CreateChat />} />
        <Route path="havent-chats" element={<HaveNotChats />} />
      </Route>
      <Route
        path="/friends"
        element={
          <PrivateRoute>
            <FriendsPage />
          </PrivateRoute>
        }
      >
        <Route path="" element={<Navigate to="your-friends" />} />
        <Route path="your-friends" element={<FriendsList />} />
        <Route
          path="received-request"
          element={<FriendsListPendingReceived />}
        />
        <Route path="sent-request" element={<FriendsListPendingSent />} />
        <Route path="search-people" element={<SearchList />} />
      </Route>
      <Route
        path={"/profile-friend/:id"}
        element={
          <PrivateRoute>
            <ProfilePageFriend />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default RootRouter;
