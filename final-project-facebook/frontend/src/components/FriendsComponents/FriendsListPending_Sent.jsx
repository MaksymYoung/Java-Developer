import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import axiosInstance from "../../helpers/axiosInstance.js";
import Button from "../Buttons/Button/Button.jsx";
import "./FriendsList.scss";
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";
import {
  friendRequestRevoke,
  allSentRequests,
} from "../../store/slices/friendSlice.js";
import { actionGetAllAvatars } from "../../store/slices/avatarSlice.js";
import { setSelectedUserId } from "../../store/slices/userSlice.js";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";

const FriendsListPendingSent = () => {
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const { showTitle } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allPendingSentRequests = useSelector((state) => state.friend.allPendingSentRequests);
  const avatars = useSelector((state) => state.avatar.avatars);
  const [friendDetails, setFriendDetails] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [visibleFriends, setVisibleFriends] = useState(10);

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const friendPromises = allPendingSentRequests.map(async (request) => {
          const response = await axiosInstance.get(`/api/v1/users/${request.receiverId}`);
          dispatch(actionGetAllAvatars({ userId: request.receiverId }));
          return { [request.receiverId]: response.data };
        });

        const results = await Promise.all(friendPromises);
        const details = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setFriendDetails(details);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (allPendingSentRequests.length > 0) {
      fetchFriendDetails();
    }
  }, [allPendingSentRequests, dispatch]);

  const handleRevoke = async (event, request) => {
    event.stopPropagation();
    const friend = friendDetails[request.receiverId];

    if (!friend) {
      console.error(`No details found for user with ID ${request.receiverId}`);
      return;
    }

    if (!request.id) {
      console.error(`Request ID is missing for the friend request to ${request.receiverId}`);
      return;
    }

    setSelectedRequest({ id: request.id, name: `${friend.firstName} ${friend.lastName}`, receiverId: request.receiverId });
    setShowConfirmModal(true)
  };

  const confirmRevokeFriend = async () => {
    if (!selectedRequest) return;

    try {
      await dispatch(friendRequestRevoke({ id: selectedRequest.receiverId })).unwrap();
      dispatch(allSentRequests());
    } catch (error) {
      console.error("Failed to Reject friend request:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedRequest(null)
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
            This is a page for your sent requests to add friends.
          </h1>
        )}
        <ul className="friends-contant">
          {allPendingSentRequests && allPendingSentRequests.length > 0 ? (
            allPendingSentRequests.slice(0, visibleFriends).map((request) => (
              <li key={request.id} className="friends-contant__item">
                <div className="friends-contant__card" >
                  <a
                    href={`/profile-friend/${ request.receiverId }`}
                    onClick={(e) => handleUserSelect({ id: request.receiverId }, e)}
                    onContextMenu={(e) => e.stopPropagation()}
                    rel="noopener noreferrer"
                  >
                    <div className="friends-contant__card-header">
                      <img
                        className="friends-contant__avatar-img"
                        src={
                          avatars[request.receiverId]
                            ? `${baseURL}${avatars[request.receiverId]}`
                            : PhotoAvaDefault
                        }
                        alt={`Avatar of ${friendDetails[request.receiverId]?.firstName || "User"}`}
                      />
                    </div>
                  </a>
                  <div className="friends-contant__card-main">
                    <div className="friends-contant__text-block">
                      <p className="friends-contant__user-name">
                        {/* <p className="friends-contant__user-name"> */}
                        <strong>
                          {friendDetails[request.receiverId]?.firstName || "Loading..."}
                          &nbsp; {friendDetails[request.receiverId]?.lastName || ""}
                        </strong>
                      </p>
                      {/* <p className="friends-contant__user-id">
                        <strong>Receiver ID:</strong> {request.receiverId}
                      </p> */}
                      {/* <p><strong>Status:</strong> {request.status}</p> */}
                      {/* <p><strong>Sender ID:</strong> {request.senderId}</p> */}
                      {/* <p><strong>id:</strong> {request.id}</p> */}
                    </div>
                    <div className="friends-contant__button-wrapper">
                      <Button
                        className="fb-gray"
                        onClick={(event) => handleRevoke(event, request)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>You have no submitted friend requests pending approval.</li>
          )}
          <div className="friends-contant__button-show">
            {Array.isArray(allPendingSentRequests) && visibleFriends < allPendingSentRequests.length && ( // Показувати кнопку, якщо ще є запити
              <Button className="fb-blue friends__button-show-more" onClick={handleShowMore}>Show more ...</Button>
            )}
          </div>
        </ul>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to revoke the friend request to&nbsp;
              <span className="confirm-modal__name">{selectedRequest?.name}</span>&nbsp;?
            </>
          }
          onConfirm={confirmRevokeFriend}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

    </>
  );
};

export default FriendsListPendingSent;
