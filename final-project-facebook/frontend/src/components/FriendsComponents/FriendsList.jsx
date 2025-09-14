import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import axiosInstance from "../../helpers/axiosInstance.js";
import Button from "../Buttons/Button/Button.jsx";
import "./FriendsList.scss";
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";
import { friendRequestRemove } from "../../store/slices/friendSlice.js";
import { actionGetAllAvatars } from "../../store/slices/avatarSlice.js";
import { setSelectedUserId } from "../../store/slices/userSlice.js";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";

const FriendsList = () => {
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const { showTitle } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const friends = useSelector((state) => state.friend.allFriends);
  const avatars = useSelector((state) => state.avatar.avatars);
  const [friendDetails, setFriendDetails] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [visibleFriends, setVisibleFriends] = useState(10);

  useEffect(() => {
    const fetchFriendDetails = async () => {
      const friendPromises = friends.map(async (friendId) => {
        try {
          const response = await axiosInstance.get(`/api/v1/users/${friendId}`);
          return { [friendId]: response.data };
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          return { [friendId]: null };
        }
      });

      const results = await Promise.all(friendPromises);
      const details = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setFriendDetails(details);

      friends.forEach((friendId) => {
        dispatch(actionGetAllAvatars({ userId: friendId }));
      });
    };

    if (friends.length > 0) {
      fetchFriendDetails();
    }
  }, [friends, dispatch]);

  const handleRemoveFriends = async (friendId, event) => {
    event.stopPropagation();
    const friend = friendDetails[friendId];
    setSelectedFriend({ id: friendId, name: `${friend.firstName} ${friend.lastName}` });
    setShowConfirmModal(true)
  };

  const confirmRemoveFriend = async () => {
    if (!selectedFriend) return;

    try {
      await dispatch(friendRequestRemove({ id: selectedFriend.id })).unwrap();
    } catch (error) {
      console.error("Failed to remove friend request:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedFriend(null);
    }
  };

  const handleUserSelect = (user, e) => {
    if (e.button === 0) {
      e.preventDefault();
      dispatch(setSelectedUserId(user.id));
      navigate(`/profile-friend/${user.id}`);
    }
  };

  const handleShowMore = () => {
    setVisibleFriends((prev) => prev + 10);
  };

  return (
    <>
      <div className="friends-contant__container">
        {showTitle && (
          <h1 className="friends-contant__title">
            This is a page for your friends list.
          </h1>
        )}
        <ul className="friends-contant">
          {friends && friends.length > 0 ? (
            friends.slice(0, visibleFriends).map((friendId) => (  // Лише перші visibleFriends друзів
              <li key={friendId} className="friends-contant__item">
                <div className="friends-contant__card" >
                  <a
                    href={`/profile-friend/${friendId}`}
                    onClick={() => handleUserSelect({ id: friendId }, e)}
                    onContextMenu={(e) => e.stopPropagation()}
                    rel="noopener noreferrer"
                  >
                    <div className="friends-contant__card-header">
                      <img
                        className="friends-contant__avatar-img"
                        src={
                          avatars[friendId] ? `${baseURL}${avatars[friendId]}`
                            : PhotoAvaDefault
                        }
                        alt={`Avatar of ${friendDetails[friendId]?.firstName || "User"
                          }`}
                      />
                    </div>
                  </a>
                  <div className="friends-contant__card-main">
                    <div className="friends-contant__text-block">
                      <p className="friends-contant__user-name">
                        <strong>
                          {friendDetails[friendId]?.firstName || "Loading..."}
                          &nbsp; {friendDetails[friendId]?.lastName || ""}
                        </strong>
                      </p>
                      {/* <p className="friends-contant__user-id">User ID: {friendId}</p> */}
                    </div>
                    <div className="friends-contant__button-wrapper">
                      <Button
                        className="fb-gray"
                        onClick={(event) => handleRemoveFriends(friendId, event)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>
              You don't have any friends on this platform yet, but we're sure
              you'll find them soon!
            </li>
          )}
          <div className="friends-contant__button-show">
            {Array.isArray(friends) && visibleFriends < friends.length && ( // Показувати кнопку, якщо ще є друзі
              <Button className="fb-blue friends__button-show-more" onClick={handleShowMore}>Show more ...</Button>
            )}
          </div>
        </ul>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to UnFriend&nbsp;
              <span className="confirm-modal__name">{selectedFriend.name}</span>
              &nbsp;?
            </>
          }
          onConfirm={confirmRemoveFriend}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

    </>
  );
};

export default FriendsList;
