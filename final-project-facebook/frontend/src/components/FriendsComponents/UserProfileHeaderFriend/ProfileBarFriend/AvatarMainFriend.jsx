import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./AvatarMainFriend.scss";
import { actionGetAllAvatars } from "../../../../store/slices/avatarSlice.js";
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";

const AvatarMainFriend = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(actionGetAllAvatars({ userId: id }));
    }
  }, [dispatch, id]);

  const avatar = useSelector((state) => state.avatar.avatars[id]);

  const baseURL = import.meta.env.VITE_HEAD_URL;
  const avatarURL = avatar ? `${baseURL}${avatar}` : PhotoAvaDefault;

  return (
    <div className="avatar__main_friend">
      <div className="avatar__viewport_friend">
        <img
          className="avatar__img_friend"
          src={avatarURL}
          alt="User Avatar"
        />
      </div>
    </div>
  );
};

export default AvatarMainFriend;