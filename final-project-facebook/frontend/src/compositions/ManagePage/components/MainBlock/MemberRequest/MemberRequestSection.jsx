import cn from "classnames";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../../helpers/axiosInstance.js";
import SearchInput from "../../../../../components/SearchInput/SearchInput";
import MemberRequestHeader from "./MemberRequestHeader";
import "./MemberRequestSection.scss";
import MemberItem from "./MemberItem.jsx";

import { useDispatch, useSelector } from "react-redux";
import NoMembers from "../../../../../icons/group-v2.svg?react";
import {
    fetchGetJoinRequest,
    fetchRejectJoin,
    fetchApproveJoin,
    fetchGroupById,
} from "../../../../../store/slices/groupsSlice";
import {
    membersPending,
    filterPendingRequest,
} from "../../../../../store/slices/privateGroupPendingSlice.js"

const MemberRequestSection = (props) => {
    const { className, groupId } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getJoinRequest = useSelector((state) => state.groups.joinRequest);
    const membersStatusPending = useSelector((state) => state.privateGroupPending.privateGroupPending);

    const handleReject = (requestId) => {
        dispatch(fetchRejectJoin(requestId));
        dispatch(filterPendingRequest(requestId));
    }

    const handleApprove = (requestId) => {
        dispatch(fetchApproveJoin(requestId));
        dispatch(filterPendingRequest(requestId));
        dispatch(fetchGroupById(groupId));
    }

    useEffect(() => {
        if (getJoinRequest?.length === 0 || !getJoinRequest) {
            dispatch(fetchGetJoinRequest(groupId));
        }
    }, [dispatch]);

    useEffect(() => {
        const membersInfo = async () => {
            const details = [];
            if (getJoinRequest && getJoinRequest.length !== 0) {
                for (const item of getJoinRequest) {
                    let idUser = item.userId;
                    let id = item.id;
                    try {
                        const response = await axiosInstance.get(`/api/v1/users/${idUser}`);
                        details[idUser] = { userId: idUser, joinId: id, ...response.data }
                    } catch (error) {
                        console.error("Failed to fetch user details:", error);
                    }
                }
            } else return
            dispatch(membersPending(details));
        };
        if (membersStatusPending.length === 0) {
            membersInfo()
        } else return
    }, [getJoinRequest, dispatch]);

    const [search, setSearch] = useState("");
    const [searchArr, setSearchArr] = useState("");
    const handleInputChange = (event) => {
        setSearchArr(event.target.value);
        setSearch("")
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            setSearch(searchArr.replace(/\s/g, ''));
        }
    };

    return (
        <div className={cn("member-request-wrapper", className)}>
            <div className="header-section">
                <MemberRequestHeader>Members request</MemberRequestHeader>
                <SearchInput
                    type="text"
                    name="member-search"
                    placeholder="Search member"
                    value={searchArr}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <div className="group-members-section" >
                {(membersStatusPending && membersStatusPending.length !== 0)
                    ?
                    <>
                        {membersStatusPending.
                            filter((item) => {
                                return search.toLowerCase() === ""
                                    ?
                                    item
                                    :
                                    (item.firstName + item.lastName).toLowerCase().match(search.toLowerCase())
                            })
                            .slice(0, 15).map((member, index) =>
                                <MemberItem key={member.userId} friend={member} handleReject={handleReject} handleApprove={handleApprove} ></MemberItem>
                            )}
                    </>
                    :
                    <div className="group-no-members">
                        <NoMembers className="no-members-icon" />
                        <p className="no-members-text">No pending members</p>
                    </div>}
            </div>
        </div>
    )
}

export default MemberRequestSection