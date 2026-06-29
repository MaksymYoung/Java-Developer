import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Aside from "../../compositions/Aside/Aside";
import TitleAside from "../../components/TitleAside/TitleAside";
import "./ChatsPage.scss";
import NewMessageIcon from "../../icons/newMessage.svg?react";
import DotsIcon from "../../icons/chats/three-dots-horizontal.svg?react";
import SearchInput from "../../components/SearchInput/SearchInput";
import ChatItem from "./components/ChatItem";
import {
  addChatGroup,
  fetchGroupChats,
  fetchMessagesGroupChats,
  removeChatGroup,
  removeFromGroupChat,
  renameChatGroup,
} from "../../store/slices/groupChatsSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken";
import Burger from "../../components/Burger/Burger";

const ChatsPage = () => {
  const { createdChatGroup, groupChats } = useSelector(
    (state) => state.groupChats
  );
  const userId = getUserIdFromToken();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentGroupChat, setCurrentGroupChat] = useState({});
  const [loadingChats, setLoadingChats] = useState(true);
  const [isBurger, setIsBurger] = useState(window.innerWidth < 767);
  const [isMobAside, setIsMobAside] = useState(false)
  const { client } = useWebSocket();

  const btnActiveBurger = (e) => {
    e.stopPropagation();
    setIsMobAside(prevCheck => !prevCheck)
  };

  const closeBtnActiveBurger = () => {
    setIsMobAside(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsBurger(window.innerWidth < 767);
      if (window.innerWidth > 767) {
        setIsMobAside(false)
      }
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (client && client.connected) {

      const groupSsubsribes = groupChats.map((group) => {
        return client.subscribe(
          `/topic/groupParticipants/${group.id}`,
          function (messageOutput) {
            const participants = JSON.parse(messageOutput.body);
            dispatch(
              removeFromGroupChat({
                participants: participants,
                groupId: group.id,
              })
            );
          }
        );
      });
      const newChatSubsc = client.subscribe(
        `/user/queue/newChat`,
        function (messageOutput) {
          const newGroup = JSON.parse(messageOutput.body);
          dispatch(addChatGroup(newGroup));
          navigate("/messages");
        }
      );
      const removedFromChatSubsc = client.subscribe(
        `/user/queue/removedFromChat`,
        function (messageOutput) {
          const removedGroup = JSON.parse(messageOutput.body);
          dispatch(removeChatGroup(removedGroup.id));
          navigate("/messages");
        }
      );
      const chatRenamedSubsc = client.subscribe(
        `/user/queue/chatRenamed`,
        function (messageOutput) {
          const updatedGroup = JSON.parse(messageOutput.body);
          dispatch(renameChatGroup(updatedGroup));
        }
      );
      const chatDeletedSubsc = client.subscribe(
        `/user/queue/chatDeleted`,
        function (messageOutput) {
          const deletedGroup = JSON.parse(messageOutput.body);
          const id = deletedGroup.id;
          dispatch(removeChatGroup(id));
          navigate("/messages");
        }
      );

      return () => {
        groupSsubsribes.forEach((subs) => subs.unsubscribe());
        newChatSubsc.unsubscribe();
        removedFromChatSubsc.unsubscribe();
        chatRenamedSubsc.unsubscribe();
        chatDeletedSubsc.unsubscribe();
      };
    }
  }, [groupChats, client]);

  useEffect(() => {
    setLoadingChats(true);
    dispatch(fetchGroupChats(userId)).finally(() => {
      setLoadingChats(false);
    });
  }, [dispatch, userId]);

  useEffect(() => {
    if (!loadingChats && location.pathname === "/messages") {
      if (groupChats.length > 0) {
        navigate(`${groupChats[0]?.id}`);
      } else {
        navigate("havent-chats");
      }
    }
  }, [groupChats.length, location.pathname, loadingChats]);

  useEffect(() => {
    if (createdChatGroup) {
      setCurrentGroupChat(createdChatGroup);
    }
  }, [createdChatGroup]);

  useEffect(() => {
    if (currentGroupChat.id) {
      dispatch(fetchMessagesGroupChats(currentGroupChat.id));
    }
  }, [currentGroupChat.id, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const burgerEl = document.getElementsByClassName('aside-chat-mob')[0];
      const burgerButton = document.getElementsByClassName('burger-chats')[0];
      
      if (burgerEl && !burgerEl.contains(event.target) && burgerButton && !burgerButton.contains(event.target)) {
        setIsMobAside(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobAside]);
  
  useEffect(() => {
    if (groupChats.length === 0 || !groupChats.find(chat => chat.id === currentGroupChat.id)) {
      setCurrentGroupChat({});
    }
  }, [groupChats, currentGroupChat.id]);

  return (
    <div className="chats-page-wrapper">
      {isBurger && (
        <div className="burger-chats"
          onMouseDown={(e) => { btnActiveBurger(e) }}
        >
          <Burger />
        </div>
      )}
      <Aside className={isMobAside ? 'aside-chat-mob' : 'aside-chat'}
        onActiveElement={isMobAside} onCloseAside={closeBtnActiveBurger}
      >
        <div className="chats-title-wrapper">
          <div className="chats-title">
            <TitleAside>Chats</TitleAside>
            <ul className="chats-title-icon-list">
              <li className="chats-title-icon-item">
                <DotsIcon />
              </li>
              <li
                className="chats-title-icon-item"
                onClick={() => {
                  navigate("new")
                  setIsMobAside(false)
                }}
              >
                <NewMessageIcon />
              </li>
            </ul>
          </div>
          <SearchInput
            name={"serch-messaging"}
            placeholder={"Search Messanger"}
          />
        </div>
        <ul className="group-chats-wrapper">
          {groupChats?.map((groupChat) => (
            <ChatItem key={groupChat.id} {...groupChat} setIsMobAside={setIsMobAside} />
          ))}
        </ul>
      </Aside>

      <Outlet />
    </div>
  );
};

export default ChatsPage;
