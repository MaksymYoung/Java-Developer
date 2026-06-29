import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { actionGetAvatar } from "../store/slices/avatarSlice";

const getAvatar = (userId) => {
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvatar = () => {
      setIsLoading(true);
      dispatch(actionGetAvatar({ userId })).then(() => {
        setIsLoading(false);
      });
    };

    fetchAvatar();
  }, [dispatch]);

  const pathAvatar = useSelector((state) => state.avatar.pathAvatar);

  const urlAvaMain = `${baseURL}${pathAvatar}`;
  const urlAvaDefault = `/images/user_profile/photo_ava_default.png`;

  const loadingAvatar = !pathAvatar || isLoading ? urlAvaDefault : urlAvaMain;
  return loadingAvatar;
};

export default getAvatar;
