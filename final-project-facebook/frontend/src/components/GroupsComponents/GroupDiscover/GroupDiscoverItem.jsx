import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../Buttons/Button/Button";
import Pending from "../Pending/Pending";
import imageGroupIcon from "/images/group/groups-default-cover-photo-2x.png";

import { getGroupJoinPending } from "../../../store/slices/groupsSlice";

const GroupSuggestedItem = (props) => {
  const IMG_URL = import.meta.env.VITE_GROUP_IMG_URL;
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.groups);

  const {
    name,
    coverImageUrl,
    onJoinGroup,
    onJoinPrivatGroup,
    onVistGroup,
    id,
    groupType,
    members,
  } = props;


  const [checkUrl, setCheckUrl] = useState(imageGroupIcon)
  const chechUrlImg = async (url) => {
      try {
          const response = await fetch(url);
          if (response.ok) {
              setCheckUrl(`${IMG_URL}/groups/${coverImageUrl}`)
          } else {
              setCheckUrl (imageGroupIcon)
          }
      } catch (e) {
      }
  }
  useEffect(() => {
      chechUrlImg(`${IMG_URL}/groups/${coverImageUrl}`)
  }, []);


 
  const isInGroup = Array.isArray(members) && members.includes(userId);
  const navigate = useNavigate();

  const pendingGroups = useSelector((state) => state.groups.pendingGroups);

  const pending = pendingGroups.filter(item => item.group.id === id);
  const { status } = pending[0] ? pending[0] : "";
  const [onClickStatus, setOnClickStatus] = useState("");

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  const joinPrivatGroup = () => {
    setOnClickStatus("PENDING")
    dispatch(getGroupJoinPending());
  };

  const handleNavigate = () => {
    if (groupType !== "PRIVATE") {
      navigate(`/groups/${id}`);
    } else {
      return
    }
  }

  return (
    <div className="group-item"
      onClick={() =>
        handleNavigate()
      }
    >

      <img
        className="group-item__image"
        src={
          checkUrl
        }
        alt={name}
      />

      <div className="group-item__description">
        <h6 className="group-item__title">{name}</h6>
        <p className="group-item__type">GroupType: {groupType}</p>
        {isInGroup ? (
          <Button
            type="button"
            className="fb-dark-blue group-item__btn"
            onClick={(e) => {
              handleButtonClick(e);
              onVistGroup();
            }}
          >
            Visit group
          </Button>
        )
          : (isInGroup === false && (status === "PENDING" || onClickStatus === "PENDING"))
            ?
            <>
              <Button
                type="button"
                className="fb-gray group-item__btn"
                onClick={(e) => {
                  handleButtonClick(e);
                }}
              >
                Pending
              </Button>

            </>
            : (
              <Button
                type="button"
                className="fb-gray group-item__btn"
                onClick={(e) => {
                  handleButtonClick(e);
                  (groupType && groupType === "PRIVATE") ? (onJoinPrivatGroup(id), joinPrivatGroup()) : onJoinGroup();

                }}
              >
                Join group
              </Button>
            )}
      </div>

    </div>
  );
};

GroupSuggestedItem.propTypes = {
  name: PropTypes.string,
  coverImageUrl: PropTypes.string,
  onJoinGroup: PropTypes.func,
  onVistGroup: PropTypes.func,
  id: PropTypes.number,
  members: PropTypes.array,
  groupType: PropTypes.string,
};

export default GroupSuggestedItem;
