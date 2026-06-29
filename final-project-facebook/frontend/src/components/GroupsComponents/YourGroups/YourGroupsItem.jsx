import React, { useRef, useState } from "react";
import "./YourGroups.scss";
import { Button } from "../../Buttons";
import ThreeDots from "../../../icons/chats/three-dots-horizontal.svg?react";
import PropTypes from "prop-types";
import DropDown from "../../DropDownForButtons/DropDown";
import DropDownItem from "../../DropDownForButtons/DropDownItem";
import LeaveIcon from "../../../icons/leave.svg?react";
import { useDispatch } from "react-redux";
import { leaveGroup, deleteGroup } from "../../../store/slices/groupsSlice";
import { useClickOutside } from "../../../helpers/useClickOutside";
import imageGroupIcon from "/images/group/groups-default-cover-photo-2x.png";
import { jwtDecode } from "jwt-decode";

const YourGroupsItem = (props) => {
  const IMG_URL = import.meta.env.VITE_GROUP_IMG_URL;
  const { name, coverImageUrl, onNavigate, id, ownerId } = props;
  const userId = jwtDecode(localStorage.getItem("accessToken"))?.userId;
  const [dropDown, setDropDown] = useState(false);
  const dispatch = useDispatch();
  const threeDotsRef = useRef();

  useClickOutside(threeDotsRef, () => setDropDown(false));

  const handleLeaveGroup = (groupId) => {
    dispatch(leaveGroup(groupId));
    setDropDown(false)
  };
  const handleDeleteGroup = (groupId) => {
    dispatch(deleteGroup(groupId));
    setDropDown(false)
  };

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

  return (
    <li className="your-group-item">
      <div className="your-group-item__info">
        <img
          onClick={onNavigate}
          className="your-group-item__img"
          src={checkUrl}
          alt={name}
        />
        <p onClick={onNavigate} className="your-group-item__name">
          {name}
        </p>
      </div>
      <div className="your-group-item__buttons">
        <Button
          className="fb-dark-blue your-group-item__view"
          onClick={onNavigate}
        >
          View group
        </Button>
        <div ref={threeDotsRef} className="your-group-item__three-dots-wrapper">
          <Button
            className="fb-gray your-group-item__three-dots"
            onClick={() => setDropDown(!dropDown)}
          >
            <ThreeDots />
          </Button>
          {dropDown && (
            <DropDown className="your-group-item__drop-down">
              {ownerId === userId ? (
                <DropDownItem
                  name="Delete group"
                  icon={<LeaveIcon />}
                  onClick={() => handleDeleteGroup(id)}
                />
              ) : (
                <DropDownItem
                  name="Leave group"
                  icon={<LeaveIcon />}
                  onClick={() => handleLeaveGroup(id)}
                />
              )}
            </DropDown>
          )}
        </div>
      </div>
    </li>
  );
};

YourGroupsItem.propTypes = {
  name: PropTypes.string,
  coverImageUrl: PropTypes.string,
  onNavigate: PropTypes.func,
  id: PropTypes.number,
  ownerId: PropTypes.number,
};

export default YourGroupsItem;
