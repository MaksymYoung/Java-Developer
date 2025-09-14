import React from "react";
import { ProfileNavigation } from "../../UserProfileMain/index.js";
import CoverPhotoFriend from "./CoverPhotoFriend/CoverPhotoFriend.jsx";
import ProfileBarFriend from "./ProfileBarFriend/ProfileBarFriend.jsx";
import "./UserProfileHeaderFriend.scss";

const UserProfileHeaderFriend = () => {
  return (
    <div className="user-profile__global_friend">
      <div className="user-profile__wrapper_friend">
        <CoverPhotoFriend />

        <div className="user-profile__inner_friend">
          <ProfileBarFriend />
          <ProfileNavigation />
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeaderFriend;
