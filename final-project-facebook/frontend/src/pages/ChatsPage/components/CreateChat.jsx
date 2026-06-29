import React, { useRef, useEffect } from "react";
import "./../ChatsPage.scss";
import Feed from "../../../compositions/Feed/Feed";
import { createGroupChat } from "../../../store/slices/groupChatsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputGroupChat = useRef(null);
  useEffect(() => {
    if (inputGroupChat.current) {
      inputGroupChat.current.focus();
    }
  }, []);

  const handleKeyPress = (e) => {
      if (e.key === "Enter") {
      handleCreateGroupChat(e.target.value);
    }
  };

  const handleCreateGroupChat = async (name) => {
    const resultAction = await dispatch(createGroupChat(name));
    
    if (createGroupChat.fulfilled.match(resultAction)) {
      const groupId = resultAction.payload.id;
      navigate(`/messages/${groupId}`);
    } else {
      console.error("Failed to create group chat");
    }
  };

  return (
    <Feed className="feed-chats">
    <header className="feed-chats-header">
      <div className="feed-chats-header__input-wrapper">
        <label className="feed-chats-header__label" htmlFor="createGroupChts">
          Create new chat:
        </label>
        <input
          ref={inputGroupChat}
          id="createGroupChats"
          className="feed-chats-header__input"
          type="text"
          onKeyUp={handleKeyPress}
        />
      </div>
    </header>
    </Feed>
  );
};

export default CreateChat;
