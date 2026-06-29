import React, { useEffect, useRef, useState } from "react";
import "./ChatInfo.scss";
import { useDispatch } from "react-redux";
import { searchUsersById } from "../../../store/slices/userSlice";
import { actionGetAllAvatars } from "../../../store/slices/avatarSlice";
import TreeDots from "../../../icons/chats/three-dots-horizontal.svg?react";
import DropDown from "../../../components/DropDownForButtons/DropDown";
import DropDownItem from "../../../components/DropDownForButtons/DropDownItem";
import { useClickOutside } from "../../../helpers/useClickOutside";
import { getUserIdFromToken } from "../../../helpers/userIdFromAccessToken.js";
import { removeMemberGroupChat } from "../../../store/slices/groupChatsSlice";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import RemoveUserIcon from "../../../icons/chats/user-remove.svg?react"
import ProfileUserIcon from "../../../icons/user-circle.svg?react"
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";

const ChatInfoMember = ({ member, groupId, admin }) => {
  const userId = getUserIdFromToken();
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [friendName, setFriendName] = useState("");
  const [friendImgPath, setFriendImgPath] = useState("");
  const [dropDown, setDropDown] = useState(false);
  const threeDotsRef = useRef();
  useClickOutside(threeDotsRef, () => setDropDown(false));

  const handleRemoveMember = () => {
    dispatch(removeMemberGroupChat({ groupId: groupId, userId: member }));
    setDropDown(false);
  };

  const handleVisitMember = () => {
    navigate(`/profile-friend/${member}`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await dispatch(
        searchUsersById({ userId: member })
      ).unwrap();
      const avatarPath = await dispatch(
        actionGetAllAvatars({ userId: member })
      ).unwrap();
      setFriendName(userData);
      setFriendImgPath(avatarPath);
    };

    fetchUserData();
  }, [dispatch, member]);

  return (
    <div className="chat-info__member">
      <img
        className="chat-info__member-img"
        src={friendImgPath ? `${baseURL}${friendImgPath}` : PhotoAvaDefault}
        alt={friendName?.firstName}
      />
      <p className="chat-info__member-name">
        {friendName?.firstName} {friendName?.lastName}
      </p>
      <div className="chat-info__tree-dots-wrapper" ref={threeDotsRef}>
        <TreeDots
          className="chat-info__tree-dots"
          onClick={() => setDropDown(!dropDown)}
        />
        {dropDown && (
          <DropDown className="chat-info__drop-down">
            <>
              {userId != member && userId == admin && (
                <DropDownItem
                  icon={<RemoveUserIcon />}
                  name={"Remove Member"}
                  onClick={() => {
                    handleRemoveMember();
                  }}
                />
              )}
              <DropDownItem
                icon={<ProfileUserIcon />}
                name={"View profile"}
                onClick={() => handleVisitMember()}
              />
            </>
          </DropDown>
        )}
      </div>
    </div>
  );
};

ChatInfoMember.propTypes = {
  member: PropTypes.number,
  groupId: PropTypes.number,
  admin: PropTypes.number,
};

export default ChatInfoMember;
