import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.scss";
import SideBarItem from "./SideBarItem.jsx";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken.js";
import FriendsIcon from "../../icons/sidebar/user-friends.svg?react";
import MemoriesIcon from "../../icons/sidebar/memories.svg?react";
import GroupIcon from "../../icons/sidebar/group-colored.svg?react";
import VideoIcon from "../../icons/sidebar/video-player.svg?react";
import SavedIcon from "../../icons/sidebar/save.svg?react";
import ArrowDownIcon from "../../icons/sidebar/arrow-down.svg?react";
import ArrowUpIcon from "../../icons/sidebar/arrow-up.svg?react";
import GraphBarIcon from "../../icons/sidebar/graph-bar.svg?react";
import EventsIcon from "../../icons/sidebar/events.svg?react";
import MarketPlaceIcon from "../../icons/sidebar/marketplace.svg?react";
import MessengerIcon from "../../icons/sidebar/messenger-colored.svg?react";
import FeedsIcon from "../../icons/sidebar/feeds.svg?react";
import Footer from "../../compositions/Footer/Footer.jsx";
import useFetchUserData from "../../helpers/useFetchUserData.js";

const SideBar = () => {
  const userId = getUserIdFromToken();
  const baseURL = import.meta.env.VITE_HEAD_URL;

  const navigate = useNavigate();
  const [seeMore, setSeeMore] = useState(false);

  const { friendData, loading } = useFetchUserData(userId);

  return (
    <div className="side-bar">
      <SideBarItem
        icon={
          <img
            src={
              friendData.imgPath
                ? `${baseURL}${friendData.imgPath}`
                : `./images/user_profile/photo_ava_default.png`
            }
            alt="User Avatar on Side Bar"
          />
        }
        name={
          loading
            ? "loading..."
            : `${friendData.name?.firstName} ${friendData.name?.lastName}`
        }
        onClick={() => navigate(`/profile`)}
      />
      <SideBarItem
        icon={<FriendsIcon />}
        name="Friends"
        onClick={() => navigate("/friends")}
      />
      <SideBarItem
        icon={<GroupIcon />}
        name="Groups"
        onClick={() => navigate("/groups/discover")}
      />
      <SideBarItem
        icon={<MessengerIcon />}
        name="Messenger"
        onClick={() => navigate("/messages")}
      />

      <SideBarItem
        icon={<EventsIcon />}
        name="Events"
        onClick={() => navigate("/events")}
      />
      <SideBarItem
        icon={<VideoIcon />}
        name="Videos"
        onClick={() => navigate("/videos")}
      />

      {!seeMore && (
        <SideBarItem
          icon={<ArrowDownIcon className="sidebar-item__bg" />}
          name="See more"
          onClick={() => setSeeMore(true)}
        />
      )}
      {seeMore && (
        <>
          <SideBarItem
            icon={<MemoriesIcon />}
            name="Memories"
            onClick={() => navigate("/memories")}
          />
          <SideBarItem
            icon={<GraphBarIcon />}
            name="Ads Manager"
            onClick={() => navigate("/ads-manager")}
          />
          <SideBarItem
            icon={<SavedIcon />}
            name="Saved"
            onClick={() => navigate("/saved")}
          />
          <SideBarItem
            icon={<MarketPlaceIcon />}
            name="Marketplace"
            onClick={() => navigate("/marketplace")}
          />

          <SideBarItem icon={<FeedsIcon />} name="Feeds" />
          <SideBarItem
            icon={<ArrowUpIcon className="sidebar-item__bg" />}
            name="See less"
            onClick={() => setSeeMore(false)}
          />
        </>
      )}
      <Footer />
    </div>
  );
};

export default SideBar;
