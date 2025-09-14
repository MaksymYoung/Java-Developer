import cn from "classnames";
import React, { useEffect, useState } from "react";
import MemberItem from "./MemberItem";
import { fetchGroupById } from "../../../../store/slices/groupsSlice";
import { useDispatch, useSelector } from "react-redux";
import "./GroupMembers.scss";

const GroupMembers = (props) => {
    const { className, userId, groupId, ...restProps } = props;
    const dispatch = useDispatch();
    // const [sortMembers, setSortMembers] = useState([]
    //     // [...members].sort(function(x,y){ return x == userId ? -1 : y == userId ? 1 : 0; })
    const {members} = useSelector((state)=> state.groups.group);
    // );
    const sortMembers = [...members].sort(function(x,y){ return x == userId ? -1 : y == userId ? 1 : 0; });

    useEffect(() => {
        // setSortMembers([...[...members].sort(function(x,y){ return x == userId ? -1 : y == userId ? 1 : 0; })]);
        dispatch(fetchGroupById(groupId));
      }, [dispatch]);
 
    return (
        <div className={cn("group-members-wrapper", className)}>
            <div className="members-number">
                <div className="member-title">
                    <p className="text">Members</p>
                    <p className="text"><span>&middot;</span></p>
                    <p className="number">{[...members].length}</p> 
                </div>
            </div>
            <div className="under-line"> </div>
            {
                members && members.length !== 0 ? sortMembers.map((member, index) => (
                    <MemberItem key={index} member={member}/>
                ))
                    : ""
            }
        </div>
    )
}

export default GroupMembers