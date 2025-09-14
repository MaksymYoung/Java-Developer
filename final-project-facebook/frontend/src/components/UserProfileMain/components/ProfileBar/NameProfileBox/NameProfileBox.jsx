import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import "./NameProfileBox.scss";

import Loader from "../../../../Loader/Loader";
import userName from "../../../../../helpers/userName";
import { getUserIdFromToken } from "../../../../../helpers/userIdFromAccessToken";
import { allFriends } from "../../../../../store/slices/friendSlice.js";

const NameProfileBox = () => {
  const dispatch = useDispatch();
  const userId = getUserIdFromToken();
  const fullname = userName(userId);
  const firstName = fullname.firstName;
  const lastName = fullname.lastName;

  useEffect(() => {
    dispatch(allFriends());
  }, [dispatch]);

  const friendsCount = useSelector((state) => state.friend.allFriends.length);
  const showFriendsCount = friendsCount == 0 ? false : true;

  return (
    <div className="profile-main">
      {!firstName || !lastName ? (
        <Loader className="loader_name-profile" />
      ) : (
        <>
          <p className="profile-main__name">{`${firstName} ${lastName}`}</p>
          {showFriendsCount && (
            <p className="profile-main__friends">
              <Link to="/friends" className="link">
                {friendsCount} friends
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default NameProfileBox;
