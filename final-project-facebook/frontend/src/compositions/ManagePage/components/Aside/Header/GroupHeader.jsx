import cn from "classnames";
import React, { useState, useEffect } from "react";
import imageGroupIcon from "/images/group/groups-default-cover-photo-2x.png";
import { useDispatch, useSelector } from "react-redux";
import {fetchGroupById } from "../../../../../store/slices/groupsSlice";
import "./GroupHeader.scss";

const GroupHeader = (props) => {
    const IMG_URL = import.meta.env.VITE_GROUP_IMG_URL;
    const dispatch = useDispatch();
    const { className, name, groupType, onLock, groupId, onHome, onshowMembers } = props;
    const {coverImageUrl} = useSelector((state)=> state.groups.group);
    const {members} = useSelector((state)=> state.groups.group);
    useEffect(() => {
        dispatch(fetchGroupById(groupId));
      }, [dispatch, groupId]);

    return (
        <>
            <div className={cn("group-header", className)}>
                <div className="group-icon">
                    <img className="image" src={ coverImageUrl !=="" ? `${IMG_URL}/groups/${coverImageUrl}` : imageGroupIcon } 
                    alt="group-image" onClick={() => { onHome() }} 
                    />
                </div>
                <div className="group-short-info">
                    <div className="name" onClick={() => { onHome() }}>
                        {name}
                    </div>
                    <div className="info-block">
                        {onLock()}
                        <div className="status">
                            {groupType}
                        </div>
                        <div className="members" onClick={() => { onshowMembers("People")}} >
                            {members ? members.length : ""} members
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GroupHeader;
