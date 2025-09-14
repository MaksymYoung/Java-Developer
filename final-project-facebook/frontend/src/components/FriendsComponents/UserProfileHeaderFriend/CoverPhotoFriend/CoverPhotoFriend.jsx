import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./CoverPhotoFriend.scss";
import { actionGetCover, clearCover } from "../../../../store/slices/coverPhotoSlice.js";

const CoverPhotoFriend = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(clearCover());
      dispatch(actionGetCover({ userId: id }));
    }
  }, [dispatch, id]);

  const pathCover = useSelector((state) => state.coverPhoto.pathCover);

  const baseURL = import.meta.env.VITE_HEAD_URL;
  const coverURL = pathCover ? `${baseURL}${pathCover}` : null;

  return (
    <div className="cover-photo__viewport_friend">
        <img
          className="cover-photo__img_friend"
          src={coverURL}
          alt="User Cover Photo"
        />
    </div>
  );
};

export default CoverPhotoFriend;
