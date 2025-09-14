import React, { useState } from "react";
import "./ChatInfo.scss";
import { useSelector } from "react-redux";
import ChatInfoMember from "./ChatInfoMember";
import ArrowDown from "../../../icons/sidebar/arrow-down.svg?react";
import ArrowUp from "../../../icons/sidebar/arrow-up.svg?react";
import PropTypes from 'prop-types';

const ChatInfo = ({ groupId }) => {
  const [isMembers, setIsMembers] = useState(true);
  const { groupChats } = useSelector((state) => state.groupChats);
  
  const currentGroup = groupChats?.find((group) => group.id === groupId);
  const members = currentGroup?.participants;
  const admin = currentGroup?.admin;

  return (
    <div className="chat-info">
      <p className="chat-info__name">{currentGroup?.name}</p>
      <div
        className="chat-info__members-wrapper"
        onClick={() => setIsMembers(!isMembers)}
      >
        <p className="chat-info__members">Chat members</p>
        {isMembers ? <ArrowUp /> : <ArrowDown />}
      </div>
      {isMembers &&
        members?.map((member, index) => (
          <ChatInfoMember
            key={index}
            admin={admin}
            member={member}
            groupId={groupId}
          />
        ))}
    </div>
  );
};

ChatInfo.propTypes = {
  groupId: PropTypes.number
}

export default ChatInfo;
