import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchUsersByName, setSelectedUserId } from "../../store/slices/userSlice.js";
import { friendRequestAreFriends } from "../../store/slices/friendSlice.js";
// import { actionGetAllAvatars } from "../../store/slices/avatarSlice.js";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken.js";
import axiosInstance from "../../helpers/axiosInstance";
import Search from "../../icons/search.svg?react";
import ArrowRight from "../../icons/arrow-right.svg?react";
import Friends from "../../icons/friends/friends.svg?react";
import DropDown from "../DropDownForButtons/DropDown.jsx";
import DropDownItem from "../DropDownForButtons/DropDownItem.jsx";
import Button from "../Buttons/Button/Button.jsx";
import "../../compositions/Header/Header.scss";
import "./SearchUsers.scss";

function SearchUsers() {
    const baseURL = import.meta.env.VITE_HEAD_URL;
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchDropDownOpen, setIsSearchDropDownOpen] = useState(false);
    const [friendStatuses, setFriendStatuses] = useState({});
    const [isSearchResultsVisible, setIsSearchResultsVisible] = useState(false);
    const [onlineStatuses, setOnlineStatuses] = useState({});
    const searchResults = useSelector(state => state.user.searchResults);
    const avatars = useSelector(state => state.avatar.avatars);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchDropDownRef = useRef(null);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (value.trim() !== "") {
                dispatch(searchUsersByName(value))
                    .unwrap()
                    .then((results) => {
                        if (results.length > 0) {
                            setIsSearchResultsVisible(true);
                        } else {
                            setIsSearchResultsVisible(false);
                        }
                    })
                    .catch(() => {
                        setIsSearchResultsVisible(false);
                    });
            } else {
                setIsSearchResultsVisible(false);
            }
        }, 500); // 500 мс затримки перед виконанням запиту
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== "") {
            navigate("/friends/search-people");
            setIsSearchDropDownOpen(false)
        } else if (e.key === 'Escape') {
            setIsSearchDropDownOpen(false)
        }
    };

    const handleInputClick = () => {
        setIsSearchDropDownOpen(true);
        setTimeout(() => { // Невелика затримка для фокусування
            if (inputRef.current) {
                inputRef.current.focus(); // Фокусуємо курсор на поле введення
                if (searchQuery) {
                    inputRef.current.select(); // Виділяємо текст пошуку, якщо є попередній пошук
                }
            }
        }, 0);
    };

    const handleUserSelect = (user) => {
        const userId = getUserIdFromToken();
        if (!user.id) return;

        const selectedUserId = user.id;
        dispatch(setSelectedUserId(selectedUserId));

        if (String(selectedUserId) === String(userId)) {
            navigate(`/profile`);
        } else {
            navigate(`/profile-friend/${selectedUserId}`);
        }
        setIsSearchDropDownOpen(false);
    };

    const handleInputFocus = () => {
        if (searchQuery.trim() !== "") {
            dispatch(searchUsersByName(searchQuery))
                .unwrap()
                .then((results) => {
                    if (results.length > 0) {
                        setIsSearchResultsVisible(true);
                    } else {
                        setIsSearchResultsVisible(false);
                    }
                })
                .catch(() => {
                    setIsSearchResultsVisible(false);
                });
        }
    };

    const handleClickOutside = (e) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(e.target)
        ) {
            setIsSearchDropDownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // перевіряємо чи є користувач другом і чи онлайн, якщо друг
    useEffect(() => {
        const fetchFriendStatusesAndOnline = async () => {
            if (!Array.isArray(searchResults) || searchResults.length === 0) return;

            const statusPromises = searchResults.map(async (user) => {
                try {
                    const isFriend = await dispatch(friendRequestAreFriends({ userId: user.id })).unwrap();

                    if (isFriend) {
                        const onlineStatus = await axiosInstance.get(`${baseURL}/msg/statusUser?userId=${user.id}`);
                        return { userId: user.id, isFriend, onlineStatus: onlineStatus.data };
                    } else {
                        return { userId: user.id, isFriend, onlineStatus: null };
                    }
                } catch (error) {
                    console.error("Error fetching statuses:", error);
                    return { userId: user.id, isFriend: false, onlineStatus: null };
                }
            });

            const statuses = await Promise.all(statusPromises);

            const newFriendStatuses = {};
            const newOnlineStatuses = {};

            statuses.forEach(({ userId, isFriend, onlineStatus }) => {
                newFriendStatuses[userId] = isFriend;
                if (isFriend && onlineStatus) {
                    newOnlineStatuses[userId] = onlineStatus; // Зберігаємо статус онлайн тільки для друзів
                }
            });

            setFriendStatuses(newFriendStatuses);
            setOnlineStatuses(newOnlineStatuses);
        };

        fetchFriendStatusesAndOnline();
    }, [searchResults, dispatch, baseURL]);

    return (
        <div ref={containerRef} className="header__search-container">
            <div className="header__input-label">
                <Search onClick={handleInputClick} className="header__search" />
            </div>
            {isSearchDropDownOpen && (
                <DropDown ref={searchDropDownRef} className="header__search-dropdown">
                    <input
                        type="search"
                        ref={inputRef}
                        className="header__input"
                        name="search"
                        placeholder="Search Facebook"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}  // Відправляємо по Enter в пошуку
                        onFocus={handleInputFocus} // Викликає пошук при отриманні фокуса
                        autoComplete="off" // Забороняє браузеру показувати автозаповнення
                    // autoCorrect="off"  // Вимикає автокорекцію (T9)
                    // spellCheck="false" // Вимикає перевірку орфографії
                    // inputMode="none"   // Вимикає підказки щодо введеного тексту
                    // autoCapitalize="off" // Вимикає автоматичне капіталізування тексту
                    // form="off"           // Вимикає автопідказки для форм
                    // aria-autoComplete="none" // Додає доступність для автозаповнення (вимкнуто)
                    // role="presentation"  // Вимикає доступність (як запобіжний засіб)
                    />
                    {isSearchResultsVisible && searchResults.length > 0 && (
                        <>
                            <Button
                                className="header__search-dropdown--button fb-gray"
                                onClick={() => {
                                    setIsSearchDropDownOpen(false);
                                    navigate("/friends/search-people");
                                }}
                            >
                                See all people found
                                <ArrowRight className="header__search-dropdown--button-icon" />
                            </Button>
                            {searchResults.slice(0, 10).map((user) => (
                                <DropDownItem
                                    icon={
                                        avatars[user.id]
                                            ? <img src={`${baseURL}${avatars[user.id]}`} alt="Avatar" className="header__search--avatar-icon" />
                                            : <Friends />
                                    }
                                    key={user.id}
                                    name={`${user.firstName} ${user.lastName}`}
                                    onClick={() => handleUserSelect(user)}
                                    className="header__search-item"
                                    childrenName={
                                        friendStatuses[user.id] && (
                                            <p className="header__search-item--friend-label">
                                                <span className={`header__search-item--friend-online ${onlineStatuses[user.id] === 'online' ? 'online' : ''}`}></span>
                                                friend
                                            </p>
                                        )
                                    }
                                />
                            ))}
                        </>
                    )}
                </DropDown>
            )}
        </div>
    );
}

export default SearchUsers;



    // useEffect(() => {
    //     const getUserStatus = async () => {
    //         try {
    //             const statusRequests = searchResults.map((user) =>
    //                 axiosInstance.get(`${baseURL}/msg/statusUser?userId=${user}`)
    //             );
    //             const statuses = await Promise.all(statusRequests);

    //             const newStatuses = {};
    //             statuses.forEach((response, index) => {
    //                 newStatuses[user[index]] = response.data;
    //             });

    //             setOnlineStatuses(newStatuses);
    //         } catch (error) {
    //             console.error("Error fetching initial statuses:", error);
    //         }
    //     };
    //     if (searchResults.length > 0) {
    //         getUserStatus();
    //     }
    // }, [searchResults])