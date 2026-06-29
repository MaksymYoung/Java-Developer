import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import axiosInstance from "../../helpers/axiosInstance.js";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken.js";
import { friendRequestAreFriends } from "../../store/slices/friendSlice.js";
import { actionGetAllAvatars } from "../../store/slices/avatarSlice.js";
import { setSelectedUserId } from "../../store/slices/userSlice.js";
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";
import Button from "../Buttons/Button/Button.jsx";
import "./FriendsList.scss";

const SearchList = () => {
  const baseURL = import.meta.env.VITE_HEAD_URL;
  const { showTitle } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchResults = useSelector((state) => state.user.searchResults);
  const avatars = useSelector((state) => state.avatar.avatars);
  const [searchDetails, setSearchDetails] = useState({});
  const [friendStatuses, setFriendStatuses] = useState({});
  const [onlineStatuses, setOnlineStatuses] = useState({});
  const [visibleFriends, setVisibleFriends] = useState(10);

  useEffect(() => {
    const fetchSearchDetails = async () => {
      if (!Array.isArray(searchResults)) return;

      try {
        const searchPromises = searchResults.map(async (person) => {
          const [userDataResponse, isFriend] = await Promise.all([
            axiosInstance.get(`/api/v1/users/${person.id}`),
            dispatch(friendRequestAreFriends({ userId: person.id })).unwrap()
          ]);

          let onlineStatus = null;
          if (isFriend) {
            const statusResponse = await axiosInstance.get(`${baseURL}/msg/statusUser?userId=${person.id}`);
            onlineStatus = statusResponse.data;
          }

          dispatch(actionGetAllAvatars({ userId: person.id }));

          return {
            userId: person.id,
            details: userDataResponse.data,
            isFriend: isFriend,
            onlineStatus: onlineStatus,
          };
        });

        const results = await Promise.all(searchPromises);

        const newDetails = {};
        const newFriendStatuses = {};
        const newOnlineStatuses = {};

        // Зберігаємо дані для кожного користувача
        results.forEach(({ userId, details, isFriend, onlineStatus }) => {
          newDetails[userId] = details;
          newFriendStatuses[userId] = isFriend;
          if (isFriend && onlineStatus) {
            newOnlineStatuses[userId] = onlineStatus;
          }
        });

        setSearchDetails(newDetails);
        setFriendStatuses(newFriendStatuses);
        setOnlineStatuses(newOnlineStatuses);

      } catch (error) {
        console.error("Failed to fetch user details or friendship status:", error);
      }
    };

    fetchSearchDetails()
  }, [searchResults, dispatch]);

  const handleUserSelect = (user, e) => {
    if (e.button === 0) {
      e.preventDefault(); // Запобігаємо виконанню переходу за посиланням
      const userId = getUserIdFromToken();

      const selectedUserId = user.id;
      dispatch(setSelectedUserId(selectedUserId));

      if (String(selectedUserId) === String(userId)) {
        navigate(`/profile`);
      } else {
        navigate(`/profile-friend/${selectedUserId}`);
      }
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
            Find new people and invite them as friends.
          </h1>
        )}
        <ul className="friends-contant">
          {searchResults && searchResults.length > 0 ? (
            searchResults.slice(0, visibleFriends).map((person) => (
              <li key={person.id} className="friends-contant__item">
                <div className="friends-contant__card">
                  <a
                    href={`/profile-friend/${person.id}`}
                    onClick={(e) => handleUserSelect({ id: person.id }, e)}
                    onContextMenu={(e) => e.stopPropagation()} // Зупиняємо подію контекстного меню                    
                    rel="noopener noreferrer" // Підвищення безпеки при відкритті у новій вкладці
                  >
                    <div className="friends-contant__card-header">
                      <img
                        className="friends-contant__avatar-img"
                        src={avatars[person.id]
                          ? `${baseURL}${avatars[person.id]}`
                          : PhotoAvaDefault
                        }
                        alt={`Avatar of ${searchDetails[person.id]?.firstName || "User"}`}
                      />
                    </div>
                    <div className="friends-contant__card-main">
                      <div className="friends-contant__text-block">
                        <p className="friends-contant__user-name">
                          <strong>
                            {searchDetails[person.id]?.firstName || "Loading..."}
                            &nbsp; {searchDetails[person.id]?.lastName || ""}
                          </strong>
                        </p>
                        {friendStatuses[person.id] && (
                          <p className="friends-contant__search-item--friend-label">
                            <span className={`friends-contant__search-item--friend-online ${onlineStatuses[person.id] === 'online' ? 'online' : ''}`}></span>
                            friend
                          </p>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              </li>
            ))
          ) : (
            <li>You have no found people, let's search more.</li>
          )}
          <div className="friends-contant__button-show">
            {Array.isArray(searchResults) && visibleFriends < searchResults.length && ( // Показувати кнопку, якщо ще є юзери
              <Button className="fb-blue friends__button-show-more" onClick={handleShowMore}>Show more ...</Button>
            )}
          </div>
        </ul>
      </div>
    </>
  );
};

export default SearchList;
