import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./CoverPhoto.scss";

import { ButtonClassic } from "../../../Buttons";
import {
  actionGetCover,
  actionPostCover,
  clearCover,
} from "../../../../store/slices/coverPhotoSlice";
import { getUserIdFromToken } from "../../../../helpers/userIdFromAccessToken.js";

const CoverPhoto = () => {
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const userId = getUserIdFromToken();

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [isImageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    dispatch(actionGetCover({ userId }));
  }, [dispatch, userId]);

  const pathCover = useSelector((state) => state.coverPhoto.pathCover);

  const urlCover = `${baseURL}${pathCover}`;
  const downloadCover = !pathCover ? null : urlCover;

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleUploadCover = (event) => {
    const cover = event.target.files[0];

    if (cover) {
      const imageNameLog = cover.name;

      const formData = new FormData();
      formData.append("file", cover);

      dispatch(actionPostCover({ formData, imageNameLog })).then(() => {
        dispatch(clearCover());
        dispatch(actionGetCover({ userId }));
      });
    }
  };

  return (
    <div className="cover-photo__viewport">
      {downloadCover && (
        <img
          className="cover-photo__img"
          src={downloadCover}
          alt="User Cover Photo"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          style={{ display: isImageLoaded ? "block" : "none" }}
        />
      )}
      <div className="cover-btn-bar">
        <ButtonClassic
          className="cover-btn-edit icon camera"
          onClick={handleButtonClick}
        >
          <span className="btn-span-edit">Edit cover photo</span>
        </ButtonClassic>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadCover}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default CoverPhoto;
