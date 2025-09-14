import React from "react";
import "./AsideFriends.scss";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useFetchUserData from "../../helpers/useFetchUserData";


const AsideFriendItem = ({ friend, userOnline }) => {

  const baseURL = import.meta.env.VITE_HEAD_URL;

  const { friendData, loading, error } = useFetchUserData(friend);

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <li className="aside-friends-list__item">
      <Link
        className="aside-friends-list__link"
        to={`/profile-friend/${friend}`}
      >
        <img
          className="aside-friends-list__img"
          src={friendData.imgPath ? `${baseURL}${friendData.imgPath}` : `./images/user_profile/photo_ava_default.png`}
          alt={friendData.name?.firstName}
        />
        {userOnline === 'online' && <span className="friend-online" />}
        <p className="aside-friends-list__name">
          {loading ? "loading..." : friendData.name?.firstName + " " + friendData.name?.lastName}
        </p>
      </Link>
    </li>
  );
};

AsideFriendItem.propTypes = {
  friend: PropTypes.number,
};

export default AsideFriendItem;
