import React, { useEffect } from "react";
import UserProfileHeaderFriend from "../../components/FriendsComponents/UserProfileHeaderFriend/UserProfileHeaderFriend.jsx";
import "./ProfilePageFriend.scss";

const ProfilePageFriend = () => {
  useEffect(() => {
    window.scrollTo({
      top: 400,
    });
  }, []);

  return (
    // <div className="profile-page-friend__outer">
      <div className="profile-page-friend__container user-header">
        <div className="profile-page-friend__wrapper">
          <UserProfileHeaderFriend />
          {/* <div className="profile-page__moke"></div> */}
        </div>
      </div>
    // </div>
  );
};

export default ProfilePageFriend;
