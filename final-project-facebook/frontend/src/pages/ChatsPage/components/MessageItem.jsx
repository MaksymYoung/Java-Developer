import React, { useEffect, useState } from "react";
import cn from "classnames";
import "./../ChatsPage.scss";
import { useDispatch } from "react-redux";
import { searchUsersById } from "../../../store/slices/userSlice";
import { actionGetAllAvatars } from "../../../store/slices/avatarSlice";
import PropTypes from "prop-types";
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";

const MessageItem = ({ item, userId }) => {
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const dispatch = useDispatch();
  const [userdata, setUserdata] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await dispatch(
        searchUsersById({ userId: item.senderId })
      ).unwrap();
      const avatarPath = await dispatch(
        actionGetAllAvatars({ userId: item.senderId })
      ).unwrap();
      setUserdata(userData);
      setAvatar(avatarPath);
    };

    fetchUserData();
  }, [dispatch, item.senderId]);

  return (
    <div
      key={item.id}
      className={cn("group-chat-messages__item-wrapper", {
        "chat-group-owner": item.senderId == userId,
      })}
    >
      <p
        className={cn("group-chat-messages__item-name", {
          "chat-group-owner-name": item.senderId == userId,
        })}
      >
        {userdata?.firstName}
      </p>
      <div className="group-chat-messages__item-info">
        <img
          src={avatar ? `${baseURL}${avatar}` : PhotoAvaDefault}
          alt={userdata?.firstName}
          className="group-chat-messages__item-avatar"
        />
        <p className="group-chat-messages__item-message">{item.content}</p>
      </div>
    </div>
  );
};

MessageItem.propTypes = {
  item: PropTypes.object,
  userId: PropTypes.number,
};

export default MessageItem;
