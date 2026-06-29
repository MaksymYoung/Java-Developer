import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import axiosInstance from "../../helpers/axiosInstance.js";
import Button from "../Buttons/Button/Button.jsx";
import {
  friendRequestAprove,
  friendRequestReject,
  allReceivedPendingRequests,
  allFriends,
  allSentRequests,
} from "../../store/slices/friendSlice.js";
import "./FriendsList.scss";
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";
import { actionGetAllAvatars } from "../../store/slices/avatarSlice.js";
import { setSelectedUserId } from "../../store/slices/userSlice.js";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";

const FriendsListPendingReceived = () => {
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const { showTitle } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allPendingReceivedRequests = useSelector((state) => state.friend.allPendingReceivedRequests); // масив всіх отриманих запитів на дружбу, що очікують
  // const allPendingSentRequests = useSelector((state) => state.friend.allPendingSentRequests); // масив всіх відправлених запитів на дружбу, що очікують
  const avatars = useSelector((state) => state.avatar.avatars);
  const [friendDetails, setFriendDetails] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [visibleFriends, setVisibleFriends] = useState(10);

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const friendPromises = allPendingReceivedRequests.map(async (request) => {
          const response = await axiosInstance.get(`/api/v1/users/${request.senderId}`);
          dispatch(actionGetAllAvatars({ userId: request.senderId }));
          return { [request.senderId]: response.data };
        });

        const results = await Promise.all(friendPromises);
        const details = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setFriendDetails(details);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (allPendingReceivedRequests.length > 0) {
      fetchFriendDetails();
    }
  }, [allPendingReceivedRequests, dispatch]);

  const handleAprove = async (id, event) => {
    event.stopPropagation();
    try {
      await dispatch(friendRequestAprove({ id })).unwrap();
      dispatch(allReceivedPendingRequests());
      dispatch(allFriends());
      dispatch(allSentRequests());
    } catch (error) {
      console.error("Failed to aprove friend request:", error);
    }
  };

  const handleReject = async (event, request) => {
    event.stopPropagation();  // Зупиняє поширення події кліка батьківську картку
    const friend = friendDetails[request.senderId];

    if (!friend) {
      console.error(`No details found for user with ID ${request.senderId}`);
      return;
    }

    setSelectedRequest({ id: request.id, name: `${friend.firstName} ${friend.lastName}` });
    setShowConfirmModal(true)

    // // Додано підтвердження дії відхилення запиту через window.confirm
    // const isConfirmed = window.confirm("Are you sure you want to reject the friend request?");
    // if (!isConfirmed) {
    //   return;  // Якщо користувач відмовився, виходимо з функції
    // }
  };

  const confirmRejectFriend = async () => {
    if (!selectedRequest) return;

    try {
      await dispatch(friendRequestReject({ id: selectedRequest.id })).unwrap();
      dispatch(allReceivedPendingRequests());
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
            This is a request page where friends invite you to join.
          </h1>
        )}
        <ul className="friends-contant">
          {allPendingReceivedRequests && allPendingReceivedRequests.length > 0 ? (
            allPendingReceivedRequests.slice(0, visibleFriends).map((request) => (
              <li key={request.id} className="friends-contant__item">
                <div className="friends-contant__card" >
                  <a
                    href={`/profile-friend/${request.senderId}`}
                    onClick={() => handleUserSelect({ id: request.senderId }, e)}
                    onContextMenu={(e) => e.stopPropagation()}
                    rel="noopener noreferrer"
                  >
                    <div className="friends-contant__card-header">
                      <img
                        className="friends-contant__avatar-img"
                        src={
                          avatars[request.senderId] ? `${baseURL}${avatars[request.senderId]}`
                            : PhotoAvaDefault
                        }
                        alt={`Avatar of ${friendDetails[request.senderId]?.firstName || "User"}`}
                      />
                    </div>
                  </a>
                  <div className="friends-contant__card-main">
                    <div className="friends-contant__text-block">
                      <p className="friends-contant__user-name">
                        <strong>
                          {friendDetails[request.senderId]?.firstName || "Loading..."}
                          &nbsp; {friendDetails[request.senderId]?.lastName || ""}
                        </strong>
                      </p>
                      {/* <p className="friends-contant__user-id"><strong>Sender ID:</strong> {request.senderId}</p> */}
                      {/* <p><strong>Status:</strong> {request.status}</p> */}
                      {/* <p><strong>Receiver ID:</strong> {request.receiverId}</p> */}
                      {/* <p><strong>id:</strong> {request.id}</p> */}
                    </div>
                    <div className="friends-contant__button-wrapper">
                      <Button onClick={(event) => handleAprove(request.id, event)}>
                        Aprove
                      </Button>
                      <Button
                        onClick={(event) => handleReject(event, request)}
                        className="fb-gray"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>You have no new friend requests.</li>
          )}
          <div className="friends-contant__button-show">
            {Array.isArray(allPendingReceivedRequests) && visibleFriends < allPendingReceivedRequests.length && ( // Показувати кнопку, якщо ще є запити
              <Button className="fb-blue friends__button-show-more" onClick={handleShowMore}>Show more ...</Button>
            )}
          </div>
        </ul>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          message={
            <>
              Are you sure you want to reject the friend request from&nbsp;
              <span className="confirm-modal__name">{selectedRequest?.name}</span>&nbsp;?
            </>
          }
          onConfirm={confirmRejectFriend}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

    </>
  );
};

export default FriendsListPendingReceived;
