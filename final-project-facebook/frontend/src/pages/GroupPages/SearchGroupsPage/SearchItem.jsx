import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/Buttons/Button/Button";
import { jwtDecode } from "jwt-decode";
import imageGroupIcon from "/images/group/groups-default-cover-photo-2x.png";
import "./SearchItem.scss";

const SearchItem = (props) => {
  const IMG_URL = import.meta.env.VITE_GROUP_IMG_URL;
  const userId = jwtDecode(localStorage.getItem('accessToken')).userId;
  const { name, coverImageUrl, onJoinGroup, onVisit, id, groupType, members } = props;
  const isInGroup = Array.isArray(members) && members.includes(userId);

  return (
    <div className="search-group-item">
      <Link to={`/groups/${id}`} className="search-group-item__link">
        <img
          className="search-group-item__img"
          src={coverImageUrl ? `${IMG_URL}/groups/${coverImageUrl}` : imageGroupIcon}
          alt={name}
        ></img>
      </Link>
      <div className="search-group-item__info">
        <Link to={`/groups/${id}`} className="search-group-item__name">{name}</Link>
        <p className="search-group-item__type">Group type: {groupType}</p>
      </div>
      {isInGroup ? (
        <Button onClick={onVisit} className="fb-dark-blue search-group-item__btn">Visit</Button>
      ) : (
        <Button onClick={onJoinGroup} className="fb-gray search-group-item__btn">
          Join
        </Button>
      )}
    </div>
  );
};

SearchItem.propTypes = {
  name: PropTypes.string,
  coverImageUrl: PropTypes.string,
  onJoinGroup: PropTypes.func,
  onVisit: PropTypes.func,
  id: PropTypes.number,
  members: PropTypes.array,
  groupType: PropTypes.string,
};

export default SearchItem;
