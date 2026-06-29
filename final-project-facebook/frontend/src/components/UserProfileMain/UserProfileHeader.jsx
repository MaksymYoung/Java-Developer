import React from "react";
import "./UserProfileHeader.scss";
import "./UserProfileButtonIcons.scss";

import { CoverPhoto, ProfileBar, ProfileNavigation } from "./";

const UserProfileHeader = () => {
  return (
    <>
      <div className="profile-header__wrapper">
        <CoverPhoto />

        <div className="user-profile__inner-header">
          <ProfileBar />
          <ProfileNavigation />
        </div>
      </div>
    </>
  );
};

export default UserProfileHeader;
