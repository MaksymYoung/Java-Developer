import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchUsersById } from "../store/slices/userSlice";
import { actionGetAllAvatars } from "../store/slices/avatarSlice";

const useFetchUserData = (userId) => {
  const [friendData, setFriendData] = useState({
    name: "",
    imgPath: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await dispatch(searchUsersById({ userId: userId })).unwrap();
        const avatarPath = await dispatch(actionGetAllAvatars({ userId: userId })).unwrap();

        setFriendData({
          name: userData,
          imgPath: avatarPath,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching user data");
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [dispatch, userId]);

  return { friendData, loading, error };
};

export default useFetchUserData;