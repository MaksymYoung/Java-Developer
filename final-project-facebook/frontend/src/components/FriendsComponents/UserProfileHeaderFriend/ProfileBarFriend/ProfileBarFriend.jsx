import React from "react";
import AvatarMainFriend from "./AvatarMainFriend.jsx";
import NameProfileBoxFriend from "./NameProfileBoxFriend.jsx";
import ButtonFriend from "../../../Buttons/ButtonFriend/ButtonFriend.jsx";
import "./ProfileBarFriend.scss";

const ProfileBarFriend = () => {
  return (
    <div className="profile-bar-friend">
      <AvatarMainFriend />
      <NameProfileBoxFriend />
      <ButtonFriend />
    </div>
  );
};

export default ProfileBarFriend;
