import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import "./AvatarMain.scss";

import { ButtonPlateCamera } from "../../../../Buttons";
import {
  actionGetAvatar,
  actionPostAvatar,
  clearAvatar,
} from "../../../../../store/slices/avatarSlice";

import getAvatar from "../../../../../helpers/getAvatar";
import { getUserIdFromToken } from "../../../../../helpers/userIdFromAccessToken";

const AvatarMain = () => {
  const userId = getUserIdFromToken();
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);
  const loadingAvatar = getAvatar(userId);

  const [isImageLoaded, setImageLoaded] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadAvatar = (event) => {
    const avatar = event.target.files[0];
    if (avatar) {
      const imageNameLog = avatar.name;

      const formData = new FormData();
      formData.append("file", avatar);

      dispatch(actionPostAvatar({ formData, imageNameLog })).then(() => {
        dispatch(clearAvatar());
        dispatch(actionGetAvatar({ userId }));
      });
    }
  };

  return (
    <div className="avatar__main">
      <div className="avatar__viewport">
        <img
          className="avatar__img"
          src={loadingAvatar}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          style={{ display: isImageLoaded ? "block" : "none" }}
          alt="avatar photo"
        />
      </div>
      <ButtonPlateCamera onClick={handleButtonClick} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadAvatar}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AvatarMain;
