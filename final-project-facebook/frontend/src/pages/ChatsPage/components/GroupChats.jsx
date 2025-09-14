import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./../ChatsPage.scss";
import Aside from "../../../compositions/Aside/Aside";
import Feed from "../../../compositions/Feed/Feed";
import PhoneIcon from "../../../icons/chats/phone.svg?react";
import VideoCallIcon from "../../../icons/chats/video-call.svg?react";
import InfoIcon from "../../../icons/chats/info-circle.svg?react";
import UserAddIcon from "../../../icons/chats/user-add.svg?react";
import GifIcon from "../../../icons/chats/gif-icon.svg?react";
import PlusIcon from "../../../icons/chats/plus-circle.svg?react";
import SmileIcon from "../../../icons/chats/smile-square.svg?react";
import PhotosIcon from "../../../icons/chats/photos.svg?react";
import SendIcon from "../../../icons/chats/send-icon.svg?react";
import EditPenIcon from "../../../icons/common/editPen.svg?react";
import { fetchMessagesGroupChats } from "../../../store/slices/groupChatsSlice";
import { allFriends } from "../../../store/slices/friendSlice";
import MessageItem from "./MessageItem";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import ChatsModalAdd from "./ChatsModalAdd";
import ChatInfo from "./ChatInfo";
import ChatModalRename from "./ChatModalRename";
import { getUserIdFromToken } from "../../../helpers/userIdFromAccessToken.js";

const GroupChats = () => {
  const { client } = useWebSocket();
  const { groupChats } = useSelector((state) => state.groupChats);
  
  const dispatch = useDispatch();
  const userId = +getUserIdFromToken();
  const [isAside, setIsAside] = useState(window.innerWidth > 1200);
  const [newMsg, setNewMsg] = useState("");
  const [newMessages, setNewMessages] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [isModalRename, setIsModalRename] = useState(false);

  const messagesEndRef = useRef(null)

  const groupId = useParams();
  
  useEffect(() => {
    const fetchMessages = async () => {
        const messages = await dispatch(fetchMessagesGroupChats(groupId.id)).unwrap();
        setNewMessages(messages);
    }
    fetchMessages();
    dispatch(allFriends());
  }, [dispatch, groupId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newMessages]);

  const currentGroupChat = groupChats.find((chat) => chat.id == groupId.id);

  useEffect(() => {
    if (client && client.connected && groupId.id) {

      const newSubscription = client.subscribe(
        `/topic/groupMessages/${groupId.id}`,
        (messageOutput) => {
          const message = JSON.parse(messageOutput.body);
          if (message) {
            setNewMessages((prevMessages) => [...prevMessages, message]);
          }
        }
      );

      return () => {
        newSubscription.unsubscribe();
      }
    }
  }, [client, groupId.id]);

  const handleSendMsg = () => {
    if (newMsg.trim() && client && client.connected) {
      const messageObj = {
        senderId: +userId,
        groupId: groupId.id,
        content: newMsg,
      };
      client.send("/app/group/sendMessage", {}, JSON.stringify(messageObj));
      setNewMsg("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMsg();
  }
};

useEffect(() => {
  const handleResize = () => {
    setIsAside(window.innerWidth > 1200)
  }
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize)
},[])

  return (
    <>
      <Feed className="feed-chats">
        <header className="feed-chats-header">
            <div className="feed-chats-header__members">
              <div className="feed-chats-header__img"></div>
              <div className="feed-chats-header__names">
                {currentGroupChat?.name}
              </div>
            </div>
            <ul className="feed-chats-header__actions">
              <li className="feed-chats-header__actions-item">
                <PhoneIcon />
              </li>
              <li className="feed-chats-header__actions-item">
                <VideoCallIcon />
              </li>
              <li
                className="feed-chats-header__actions-item"
                onClick={() => window.innerWidth > 1200 && setIsAside(!isAside)}
              >
                <InfoIcon />
              </li>
            </ul>
        </header>
        <div className="message-container">
          <div className="message-container__info-wrapper">
            <p className="message-container__name">{currentGroupChat?.name}</p>
            {userId == currentGroupChat?.admin && (
              <>
                <p className="message-container__desc">
                  You created this group
                </p>
                <ul className="message-container__icon-list">
                  <li
                    className="message-container__icon-item"
                    onClick={() => setIsModal(true)}
                  >
                    <div className="message-container__icon-block">
                      <div className="svg-wrapper">
                        <UserAddIcon />
                      </div>
                      <p className="svg-info">Add</p>
                    </div>
                  </li>
                  <li className="message-container__icon-item"
                      onClick={() => setIsModalRename(true)}
                  >
                    <div className="message-container__icon-block">
                      <div className="svg-wrapper">
                        <EditPenIcon />
                      </div>
                      <p className="svg-info">Name</p>
                    </div>
                  </li>
                </ul>
              </>
            )}
          </div>
          <div className="group-chat-messages">
            {newMessages?.map((item, index) => (
              <MessageItem key={index} item={item} userId={userId} messagesEndRef={messagesEndRef} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="send-message">
          <ul className="send-message__icons">
            <li className="send-message__icons-item">
              <PlusIcon />
            </li>
            <li className="send-message__icons-item">
              <PhotosIcon />
            </li>
            <li className="send-message__icons-item">
              <SmileIcon />
            </li>
            <li className="send-message__icons-item">
              <GifIcon />
            </li>
          </ul>
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="send-message__input"
            type="text"
            placeholder="Aa"
            onKeyUp={handleKeyPress}
          />
          <div className="send-message__icons-item" onClick={handleSendMsg}>
            <SendIcon />
          </div>
        </div>
      </Feed>
      {isAside && <Aside className="aside-info"><ChatInfo groupId={+groupId.id} /></Aside>}
      {isModal && (
        <ChatsModalAdd setIsModal={setIsModal} groupId={+groupId.id}/>
      )}
      {isModalRename && (
        <ChatModalRename setIsModalRename={setIsModalRename} groupId={+groupId.id}/>
      )}
    </>
  );
};

export default GroupChats;
