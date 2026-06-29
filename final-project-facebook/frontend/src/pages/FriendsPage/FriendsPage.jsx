import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Aside from "../../compositions/Aside/Aside.jsx";
import cn from "classnames";
import Feed from "../../compositions/Feed/Feed.jsx";
import Burger from "../../components/Burger/Burger.jsx";
import "./FriendsPage.scss";
import TitleAside from "../../components/TitleAside/TitleAside.jsx";
import Friends from "../../icons/friends/friends.svg?react";
import FriendAdd from "../../icons/friends/friendAdd.svg?react";
import FriendExpect from "../../icons/friends/friendExpect.svg?react";
import Search from "../../icons/search.svg?react";
import { allFriends, allSentRequests, allReceivedPendingRequests } from "../../store/slices/friendSlice.js";

const FriendsPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        dispatch(allFriends());
        dispatch(allSentRequests());
        dispatch(allReceivedPendingRequests());
    }, [dispatch]);

    const escKey = (event) => {
        if (event.key === "Escape") {
            return setActiveElement(false);
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', escKey);
        return
    }, [])

    const [activeElement, setActiveElement] = useState(false);

    const btnActiveBurger = (e) => {
        e.stopPropagation();
        setActiveElement(prevCheck => !prevCheck)
    };

    const closeBtnActiveBurger = () => {
        setActiveElement(false);
    };

    const handleResize = (event) => {
        if (event.target.innerWidth > 768) {
            setActiveElement(false)
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const showTitle = true;

    return (
        <>
            <div className="friends-page-wrapper">
                <Aside className={`friends-aside media-aside ${activeElement ? "aside-active" : ""} `}
                    onActiveElement={activeElement} onCloseAside={closeBtnActiveBurger}
                >
                    <TitleAside className="friends-aside__title">Friends</TitleAside>
                    <ul className="friends-list">
                        <li className="friends-list__item">
                            <Link
                                className={cn("friends-list__link", {
                                    activeFriends: location.pathname.startsWith("/friends/your-friends"),
                                })}
                                to="/friends/your-friends"
                            >
                                <div className="friends-list__icon-wrapper">
                                    <Friends />
                                </div>
                                Your friends
                            </Link>
                        </li>
                        <li className="friends-list__item">
                            <Link
                                className={cn("friends-list__link", {
                                    activeFriends: location.pathname.startsWith("/friends/received-request"),
                                })}
                                to="/friends/received-request"
                            >
                                <div className="friends-list__icon-wrapper">
                                    <FriendAdd />
                                </div>
                                Your received requests
                            </Link>
                        </li>
                        <li className="friends-list__item">
                            <Link
                                className={cn("friends-list__link", {
                                    activeFriends: location.pathname.startsWith("/friends/sent-request"),
                                })}
                                to="/friends/sent-request"
                            >
                                <div className="friends-list__icon-wrapper">
                                    <FriendExpect />
                                </div>
                                Your sent requests
                            </Link>
                        </li>
                        <li className="friends-list__item">
                            <Link
                                className={cn("friends-list__link", {
                                    activeFriends: location.pathname.startsWith("/friends/search-people"),
                                })}
                                to="/friends/search-people"
                            >
                                <div className="friends-list__icon-wrapper">
                                    <Search className="friends-list__icon-search" />
                                </div>
                                Search for people
                            </Link>
                        </li>
                    </ul>
                </Aside>
                <Feed className="friends-feed">
                    <div className={`burger ${activeElement ? "burger-active" : ""} `}
                        onMouseDown={(e) => { btnActiveBurger(e) }}
                    >
                        <Burger />
                    </div>
                    <Outlet context={{ showTitle }} />
                </Feed>
                <p></p>
            </div>
        </>
    );
};

export default FriendsPage;
