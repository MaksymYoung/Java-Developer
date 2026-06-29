import React from 'react'
import DropDown from '../DropDownForButtons/DropDown'
import DropDownItem from '../DropDownForButtons/DropDownItem'
import "./HeaderMenuDropdown.scss"

import FriendsIcon from "../../icons/sidebar/user-friends.svg?react";
import MemoriesIcon from "../../icons/sidebar/memories.svg?react";
import GroupIcon from "../../icons/sidebar/group-colored.svg?react";
import VideoIcon from "../../icons/sidebar/video-player.svg?react";
import SavedIcon from "../../icons/sidebar/save.svg?react";
import GraphBarIcon from "../../icons/sidebar/graph-bar.svg?react";
import EventsIcon from "../../icons/sidebar/events.svg?react";
import MarketPlaceIcon from "../../icons/sidebar/marketplace.svg?react";
import MessengerIcon from "../../icons/sidebar/messenger-colored.svg?react";
import FeedsIcon from "../../icons/sidebar/feeds.svg?react";
import { useNavigate } from 'react-router-dom';

const HeaderMenuDropdown = () => {
  const navigate = useNavigate();
  return (
    <DropDown className="header-menu-dropdown">
        <DropDownItem icon={<FriendsIcon />} name={"Friends"} onClick={() => navigate('/friends')} />
        <DropDownItem icon={<GroupIcon />} name={"Groups"} onClick={() => navigate('/groups/discover')} />
        <DropDownItem icon={<MarketPlaceIcon />} name={"Marketplace"} onClick={() => navigate('/marketplace')} />
        <DropDownItem icon={<MessengerIcon />} name={"Messenger"} onClick={() => navigate('/messages')} />
        <DropDownItem icon={<MemoriesIcon />} name={"Memories"} onClick={() => navigate("/memories")}/>
        <DropDownItem icon={<FeedsIcon />} name={"Feeds"} onClick={() => navigate("/feeds")}/>
        <DropDownItem icon={<VideoIcon />} name={"Videos"} onClick={() => navigate("/videos")} />
        <DropDownItem icon={<EventsIcon />} name={"Events"} onClick={() => navigate("/events")} /> 
        <DropDownItem icon={<SavedIcon />} name={"Saved"} onClick={() => navigate("/saved")} />
        <DropDownItem icon={<GraphBarIcon />} name={"Ads Manager"} onClick={() => navigate("/ads-manager")} />
    </DropDown>
  )
}

export default HeaderMenuDropdown;
