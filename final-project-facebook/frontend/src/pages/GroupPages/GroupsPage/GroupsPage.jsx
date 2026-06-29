import cn from "classnames";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Buttons/Button/Button";
import SearchInput from "../../../components/SearchInput/SearchInput";
import TitleAside from "../../../components/TitleAside/TitleAside";
import Aside from "../../../compositions/Aside/Aside";
import Feed from "../../../compositions/Feed/Feed";
import DiscoverIcon from '../../../icons/discover.svg?react';
import FeedIcon from '../../../icons/feed.svg?react';
import GroupsIcon from '../../../icons/group-v2.svg?react';
import { fetchOwnGroups, fetchUserGroups } from "../../../store/slices/groupsSlice";
import GroupItemAside from "./GroupItemAside";
import "./GroupsPage.scss";
import { jwtDecode } from "jwt-decode";
import Burger from "../../../components/Burger/Burger";

const GroupsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { ownGroups, userGroups } = useSelector((state) => state.groups);
  const userId = jwtDecode(localStorage.getItem("accessToken"))?.userId;

  const asideUserGroups = userGroups.filter((group) => group.ownerId !== userId)

  const handelNavigateCreateGroup = () => {
    navigate("/groups/create");
  };

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate("/groups/search", { state: { inputValue } });
      setInputValue(inputValue);
    }
  };

  useEffect(() => {
    dispatch(fetchOwnGroups(userId));
    dispatch(fetchUserGroups(userId));
  }, [dispatch, userId]);


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

  const cancel = (btncancel) => {
    if (btncancel === "cancel") {
      setActiveElement(false)
    }
  }

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

  return (
    <div className="groups-page-wrapper">
      <Aside className={`groups-aside media-aside ${activeElement ? "aside-active" : ""} `}
        onActiveElement={activeElement} onCloseAside={closeBtnActiveBurger}
      >
        <div className="">
          <TitleAside className="groups-aside__title">Groups</TitleAside>
          <SearchInput
            type="text"
            name="group-search"
            placeholder="Search groups"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
        <ul className="groups-list">
          {/* <li className="groups-list__item">
            <Link
              className={cn("groups-list__link", {
                activeGroup: location.pathname.startsWith("/groups/feed"),
              })}
              to="/groups/feed"
            >
              <div className="groups-list__icon-wrapper">
                <FeedIcon />
              </div>
              Your feed
            </Link>
          </li> */}
          <li className="groups-list__item">
            <Link
              className={cn("groups-list__link", {
                activeGroup: location.pathname.startsWith("/groups/discover"),
              })}
              to="/groups/discover"
              onClick={() => { dispatch(getGroupJoinPending()) }}
            >
              <div className="groups-list__icon-wrapper">
                <DiscoverIcon />
              </div>
              Discover
            </Link>
          </li>
          <li className="groups-list__item">
            <Link
              className={cn("groups-list__link", {
                activeGroup: location.pathname.startsWith(
                  "/groups/your-groups"
                ),
              })}
              to="/groups/your-groups"
            >
              <div className="groups-list__icon-wrapper">
                <GroupsIcon />
              </div>
              Your groups
            </Link>
          </li>
        </ul>
        <Button
          className="fb-dark-blue btn-add"
          onClick={handelNavigateCreateGroup}
        >
          create new group
        </Button>
        <div className="border" />
        {ownGroups?.length > 0 && (
          <>
            <div className="groups-aside__subtitle-block">
              <h2 className="groups-aside__subtitle">Groups you manage</h2>
              {/* <a href="#" className="groups-aside__see-all">
                see all
              </a> */}
            </div>
            <div className="groups-aside__group-list-wrapper">
              <ul className="groups-aside__groupown-list">
                {ownGroups?.map((group) => {
                  return <GroupItemAside onClick={() => navigate(`${group.id}/manage-group`)} key={group.id} {...group} />;
                })}
              </ul>
              <div className="border" />
            </div>
          </>
        )}
        {asideUserGroups?.length > 0 && (
          <>
            <div className="groups-aside__subtitle-block">
              <h2 className="groups-aside__subtitle">Groups you've joined</h2>
              {/* <a href="#" className="groups-aside__see-all">
                see all
              </a> */}
            </div>
            <div className="groups-aside__group-list-wrapper">
              <ul className="groups-aside__groupown-list">
                {asideUserGroups?.map((group) => {
                  return <GroupItemAside className={cn({ 'aside-group-item__active': location.pathname === `/groups/${group.id}` })} 
                  onClick={() => navigate(`${group.id}`)} key={group.id} {...group} 
                  />;
                })}
              </ul>
            </div>
          </>
        )}
      </Aside>
      <Feed className="group-feed">
        <div className={`burger ${activeElement ? "burger-active" : ""} `}
        onMouseDown={(e) => { btnActiveBurger(e) }}
        >
          <Burger />
        </div>
        <Outlet className="media-outlet" />
      </Feed>
    </div >
  );
};

export default GroupsPage;