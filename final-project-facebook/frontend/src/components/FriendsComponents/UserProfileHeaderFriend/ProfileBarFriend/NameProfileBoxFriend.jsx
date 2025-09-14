import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { searchUsersById } from "../../../../store/slices/userSlice.js";
import "./NameProfileBoxFriend.scss";

const NameProfileBoxFriend = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(searchUsersById({ userId: id }));
    }
  }, [dispatch, id]);

  const userData = useSelector((state) => state.user.userData);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { firstName, lastName } = userData;

  return (
    <div className="profile-main_friend">
      <p className="profile-main__name_friend">{`${firstName} ${lastName}`}</p>
    </div>
  );
};

export default NameProfileBoxFriend;
