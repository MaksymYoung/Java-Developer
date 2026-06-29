import React, { useEffect, useState } from "react";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken";
import { useDispatch, useSelector } from "react-redux";
import { allFriends } from "../../store/slices/friendSlice";
import AsideFriendItem from "./AsideFriendItem";
import { fetchGroupChats } from "../../store/slices/groupChatsSlice";
import AsideGroupItem from "./AsideGroupItem";
import axiosInstance from "../../helpers/axiosInstance";
import { useWebSocket } from "../../contexts/WebSocketContext";

const AsideFriends = () => {
  const dispatch = useDispatch();
  const userId = getUserIdFromToken();
  const friends = useSelector((state) => state.friend.allFriends);
  const groupChats = useSelector((state) => state.groupChats.groupChats);
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const { client } = useWebSocket();
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const [friedsLoading, setFriedsLoading] = useState(true);
  const [chatsLoading, setChatsLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        await dispatch(allFriends());
        await dispatch(fetchGroupChats(userId));
      } catch (error) {
        console.error(error);
      } finally {
        setFriedsLoading(false);
        setChatsLoading(false)
      }
    };
    fetchFriends();
  }, [dispatch, userId]);

  useEffect(() => {
    const getUserStatus = async () => {
      try {
        const statusRequests = friends.map((friend) =>
          axiosInstance.get(`${baseURL}/msg/statusUser?userId=${friend}`)
        );
        const statuses = await Promise.all(statusRequests);

        const newStatuses = {};
        statuses.forEach((response, index) => {
          newStatuses[friends[index]] = response.data;
        });

        setOnlineStatuses(newStatuses);
      } catch (error) {
        console.error("Error fetching initial statuses:", error);
      }
    };
    if (friends.length > 0) {
      getUserStatus();
    }
  }, [friends]);

  useEffect(() => {
    if (client && client.connected) {
      const subscription = client.subscribe(
        `/topic/status`,
        (messageOutput) => {
          const userStatus = JSON.parse(messageOutput.body);
          setOnlineStatuses((prevStatuses) => ({
            ...prevStatuses,
            [userStatus.userId]: userStatus.status,
          }));
        }
      );
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [client, friends]);

  return (
    <div className="aside-friends">
      <h2 className="aside-friends__title">Friends</h2>
      <ul className="aside-friends-list">
        {friedsLoading ? (
          <p className="aside-friends-list__loading">loading...</p>
        ) : friends?.length > 0 ? (
          friends?.map((friend) => {
            return (
              <AsideFriendItem
                key={friend}
                friend={friend}
                userOnline={onlineStatuses[friend]}
              />
            );
          })
        ) : (
          <p className="aside-friends-list__loading">You don't have any friends yet</p>
        )}
      </ul>
      <div className="border aside-friend-border"></div>
      <h2 className="aside-friends__title">Group chats</h2>
      <ul className="aside-friends-list">
        {chatsLoading ? (
          <p className="aside-friends-list__loading">loading...</p>
        ) : (
          groupChats?.length > 0 ? (
            groupChats?.map((groupChat) => {
              return <AsideGroupItem key={groupChat.id} {...groupChat} />;
            })
          ) : (
            <p className="aside-friends-list__loading">You don't have any chats yet</p>
          )
        )}

      </ul>
    </div>
  );
};

export default AsideFriends;
