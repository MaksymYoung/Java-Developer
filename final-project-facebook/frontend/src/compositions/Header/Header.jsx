import React, { useState, useEffect, useRef } from "react";
import FacebookLogo from "../../icons/facebook.svg?react";
import HomeIcon from "../../icons/home.svg?react";
import VideoIcon from "../../icons/videoicon.svg?react";
import FriendsIcon from "../../icons/friendsicon.svg?react";
import MarketplaceIcon from "../../icons/marketplaceicon.svg?react";
import GroupIcon from "../../icons/groupicon.svg?react";
import MenuIcon from "../../icons/menu.svg?react";
import Messenger from "../../icons/messenger.svg?react";
import Bell from "../../icons/bell.svg?react";
import More from "../../icons/more.svg?react";
import User from "../../icons/user.svg?react";
import "./Header.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import cn from "classnames";
import DropDown from "../../components/DropDownForButtons/DropDown.jsx";
import DropDownItem from "../../components/DropDownForButtons/DropDownItem.jsx";
import Logout from "../../icons/common/Logout.svg?react";
import { actionLogOutUser } from "../../store/slices/userSlice.js";
import { useDispatch } from "react-redux";
import getAvatar from "../../helpers/getAvatar";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken.js";
import SearchUsers from "../../components/SearchUsers/SearchUsers.jsx";
import HeaderMenuDropdown from "../../components/HeaderMenuDropdown/HeaderMenuDropdown.jsx";
import { useClickOutside } from "../../helpers/useClickOutside.jsx"
import useFetchUserData from "../../helpers/useFetchUserData.js";
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";

function Header() {
  const userId = getUserIdFromToken();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUserDropDownOpen, setIsUserDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleUserDropDown = () => {
    setIsUserDropDownOpen(!isUserDropDownOpen);
  };

  const handleLogout = () => {
    dispatch(actionLogOutUser());
    navigate("/login");
  };

  const handleNavigateEdit = () => {
    navigate("/profile-edit");
    setIsUserDropDownOpen(false);
  };

  const handleNavigateProfile = () => {
    navigate("/profile");
    setIsUserDropDownOpen(false);
  };

  const handleNavigateChats = () => {
    navigate("/messages");
  };

  const [isInputVisible, setIsInputVisible] = useState(
    window.innerWidth >= 1200
  );

  useEffect(() => {
    if (location.pathname === "/") {
      setIsInputVisible(true);
    } else {
      setIsInputVisible(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200 && location.pathname === "/") {
        setIsInputVisible(true);
      } else {
        setIsInputVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutsideDropDown = (event) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideDropDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropDown);
    };
  }, [isUserDropDownOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsUserDropDownOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const [isMenu, setIsMenu] = useState(false);
  const menuRef = useRef();
  const baseURL = import.meta.env.VITE_HEAD_URL;

  const loadingAvatar = getAvatar(userId);

  useClickOutside(menuRef, () => setIsMenu(false))

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">
          <FacebookLogo />
        </Link>
        <SearchUsers />
      </div>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <li className="header__nav-list-item">
            <Link
              className={cn("header__nav-list-link", {
                active: location.pathname === "/",
              })}
              to="/"
            >
              <HomeIcon />
            </Link>
          </li>
          {/* <li className="header__nav-list-item">
            <Link
              className={cn("header__nav-list-link", {
                active: location.pathname.startsWith("/video"),
              })}
              to="/video"
            >
              <VideoIcon />
            </Link>
          </li> */}
          <li className="header__nav-list-item">
            <Link
              className={cn("header__nav-list-link", {
                active: location.pathname.startsWith("/friends"),
              })}
              to="/friends"
            >
              <FriendsIcon />
            </Link>
          </li>
          {/* <li className="header__nav-list-item">
            <Link
              className={cn("header__nav-list-link", {
                active: location.pathname.startsWith("/marketplace"),
              })}
              to="/marketplace"
            >
              <MarketplaceIcon />
            </Link>
          </li> */}
          <li className="header__nav-list-item">
            <Link
              className={cn("header__nav-list-link", "group", {
                active: location.pathname.startsWith("/groups"),
              })}
              to="/groups/discover"
            >
              <GroupIcon />
            </Link>
          </li>
        </ul>
      </nav>
      <ul className="header__acount-list">
        <li className="header__acount-list-item header__account-menu" onClick={() => setIsMenu(!isMenu)} ref={menuRef}>
          <Link>
            <button className="header__acount-btn">
              <MenuIcon />
            </button>
          </Link>
          {isMenu && (
            <HeaderMenuDropdown />
          )}
        </li>
        <li className="header__acount-list-item">
          <button className="header__acount-btn" onClick={handleNavigateChats}>
            <Messenger />
          </button>
        </li>
        {/* <li className="header__acount-list-item">
          <Link to="/notification">
            <button className="header__acount-btn">
              <Bell />
            </button>
          </Link>
        </li> */}
        <li className="header__acount-list-item">
          <button
            ref={buttonRef}
            className="header__acount-btn"
            onClick={toggleUserDropDown}
          >
            <div className="header-user__avatar-container">
              <img
                className="header-user__avatar-img"
                src={loadingAvatar}
                alt="User Avatar"
              />
            </div>
          </button>
          {isUserDropDownOpen && (
            <DropDown ref={dropDownRef} className="header__user-dropdown">
              <DropDownItem
                className="header-profile__drop-down-item"
                icon={
                  // <div className="header-profile__avatar-container">
                  <img
                    className="header-profile__avatar-img"
                    // src={PhotoAvaDefault}
                    src={loadingAvatar}
                    alt="User Avatar"
                  />
                  // </div>
                }
                name="Profile"
                onClick={handleNavigateProfile}
              />
              <DropDownItem
                className="header-profile__drop-down-item"
                icon={<User />}
                name="Edit Profile"
                onClick={handleNavigateEdit}
              />
              <DropDownItem
                className="header-profile__drop-down-item"
                icon={<Logout />}
                name="Logout"
                onClick={handleLogout}
              />
            </DropDown>
          )}
        </li>
      </ul>
    </header>
  );
}

export default Header;
