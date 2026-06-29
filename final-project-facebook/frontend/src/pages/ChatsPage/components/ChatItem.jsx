import React, { useRef, useState } from "react";
import "./ChatItem.scss";
import cn from "classnames";
import PropTypes from "prop-types";
import TreeDots from "../../../icons/chats/three-dots-horizontal.svg?react";
import DeleteIcon from "../../../icons/chats/delete.svg?react";
import LeaveIcon from "../../../icons/leave.svg?react";
import DropDown from "../../../components/DropDownForButtons/DropDown";
import DropDownItem from "../../../components/DropDownForButtons/DropDownItem";
import { useClickOutside } from "../../../helpers/useClickOutside";
import { getUserIdFromToken } from "../../../helpers/userIdFromAccessToken.js";
import { useDispatch } from "react-redux";
import { deleteGroupChat, removeChatGroup, removeMemberGroupChat } from "../../../store/slices/groupChatsSlice";
import { useNavigate, useLocation } from "react-router-dom";

const ChatItem = (props) => {
  const { name, id, admin, setIsMobAside } = props;
  
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = getUserIdFromToken();

  const [isHovered, setIsHovered] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const threeDotsRef = useRef();

  useClickOutside(threeDotsRef, () => setDropDown(false));

  const handleDeleteChat = async (id) => {
    try {
      await dispatch(deleteGroupChat(id));
      await navigate("/messages");
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };
  
  const handleLeaveChat = async (groupId) => {
    try {
      await dispatch(removeMemberGroupChat({groupId: groupId, userId: userId}));
      await dispatch(removeChatGroup(groupId));
      // setDropDown(false)
      await navigate("/messages");
    } catch (error) {
      console.error("Error leaving chat:", error);
    }
  }

  return (
    <>
      <li
        className={cn("group-chat", {
          "group-chat-active": location.pathname === `/messages/${id}`,
        })}
        onClick={() => {
          navigate(`${id}`)
          setIsMobAside(false)
        }}
        onMouseEnter={(e) => {
          e.stopPropagation()
          setIsHovered(true)
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <p className="group-chat__name">{name}</p>
        <div className="group-chat__wrapper" ref={threeDotsRef}>
          {dropDown && (
            
              <DropDown className="group-chat__drop-down">
                {userId == admin ? (
                  <DropDownItem
                  className={"drop-dawn-chats-aside"}
                    name={"delete chat"}
                    icon={<DeleteIcon />}
                    onClick={() => {
                      handleDeleteChat(id);
                    }}
                  />
                ) : (
                  <DropDownItem
                  className={"drop-dawn-chats-aside"}
                    name={"leave chat"}
                    icon={<LeaveIcon />}
                    onClick={() => {
                      handleLeaveChat(id)
                    }}
                  />
                )}
              </DropDown>
            
          )}
          {(isHovered || dropDown) && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setDropDown(!dropDown);
              }}
              className="group-chat__three-dots"
            >
              <TreeDots />
            </span>
          )}
        </div>
      </li>
    </>
  );
};

ChatItem.propTypes = {
  name: PropTypes.string,
  id: PropTypes.number,
  admin: PropTypes.number,
  setIsMobAside: PropTypes.func,
};

export default ChatItem;
