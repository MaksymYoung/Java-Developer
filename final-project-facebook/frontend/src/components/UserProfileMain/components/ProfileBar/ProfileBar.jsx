import React from "react";

import "./ProfileBar.scss";

import AvatarMain from "./AvatarMain/AvatarMain";
import NameProfileBox from "./NameProfileBox/NameProfileBox";
import ButtonControlProfile from "./ButtonControlProfile/ButtonControlProfile";

const ProfileBar = () => {
  return (
    <div className="profile-bar">
      <AvatarMain />
      <NameProfileBox />
      <ButtonControlProfile />
    </div>
  );
};

export default ProfileBar;
