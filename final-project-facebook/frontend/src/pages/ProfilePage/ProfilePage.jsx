import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./ProfilePage.scss";
import "./ProfileExternalPosts.scss";
import "./ProfileExternalFriends.scss";
import "./ProfileExternalAbout.scss";
import "./ProfileExternaGroups.scss";

import UserProfileHeader from "../../components/UserProfileMain/UserProfileHeader";

const ProfilePage = () => {
  const showTitle = false;

  return (
    <div className="profile-page__outer">
      <div className="profile-page__user-header">
        <div className="profile-page__wrapper">
          <UserProfileHeader />
        </div>
      </div>

      <div className="profile-page__container">
        <div className="profile-page__wrapper user-box">
          <div className="profile-page__inner">
            <Outlet context={{ showTitle }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
