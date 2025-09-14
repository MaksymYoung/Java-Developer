import React from "react";
import "./ProfileNavigation.scss";

import ItemNavProfile from "./ItemNavProfile";
import { ButtonPlateRectangle } from "../../../../components/Buttons";
import { DotsIcon } from "../../../../icons";

const ProfileNavigation = () => {
  return (
    <div className="user-navigation__bar">
      <ul className="user-nav-list">
        <ItemNavProfile name="posts">Posts</ItemNavProfile>
        <ItemNavProfile name="friends">Friends</ItemNavProfile>
        <ItemNavProfile name="about">About</ItemNavProfile>
        <ItemNavProfile name="groups">Groups</ItemNavProfile>

        <ItemNavProfile className="profile-not-use" name="photos">
          Photos
        </ItemNavProfile>
        <ItemNavProfile className="profile-not-use" name="videos">
          Videos
        </ItemNavProfile>
        <ItemNavProfile className="profile-not-use" name="more">
          More
        </ItemNavProfile>
      </ul>
      <ButtonPlateRectangle className="dots">
        <DotsIcon className="icon__element dots" />
      </ButtonPlateRectangle>
    </div>
  );
};

export default ProfileNavigation;
