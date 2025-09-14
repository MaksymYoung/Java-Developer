import cn from "classnames";
import React, { useState, useEffect } from "react";
import { useNavigate, Link, renderMatches } from "react-router-dom";
import Button from "../../Buttons/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearInvitationGroup } from "../../../store/slices/inviteFriendToGroup"

import ModalWrapper from "../../modalComponents/ModalWrapper";
import ModalBox from "../../modalComponents/ModalBox";
import SearchInput from "../../SearchInput/SearchInput";
import Close from "../../../icons/cross.svg?react"

import FriendItem from "./FriendItem";
import SelectedFriendItem from "./SelectedFriendItem";
import "./InviteToGroupModal.scss";

const InviteToGroupModal = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { className, onCancel, ...restProps } = props;


    const friends = useSelector((state) => state.friend.allFriends);
    const [selected, setSelected] = useState(false);
    const handleSeledted = () => {
        return !selected ? setSelected(true) : setSelected(false)
    };

    const {inviteToGroup} = useSelector((state) => state.inviteFriend);

    const handleSendInvitation = () => {
        // console.log("Send invitation")
    }

    return (
        <ModalWrapper onClick={() => { dispatch(clearInvitationGroup()); onCancel("cancel") }}>
            <ModalBox className={"modal-box"}>
                <div className={cn("invite-friend-modal-wrapper", className)}>
                    <div className="invite-friend-modal-header">
                        <p>Invite friends to this group</p>
                        <div className={"close-icon-wrapper"} onClick={() => { dispatch(clearInvitationGroup()); onCancel("cancel") }}>
                            <Close className={"close-icon"} />
                        </div>

                    </div>
                    <div className="underline"></div>
                    <div className="invite-friend-modal-main">
                        <div className="aside-left">
                            <div className="search">
                                <SearchInput
                                    type="text"
                                    name="group-search"
                                    placeholder="Search member"
                                />
                            </div>
                            <p>Suggested</p>
                            <div className="friends-list">
                                {
                                    friends && friends.length !== 0 ? friends.map((friend, index) => (
                                        <FriendItem key={index} friend={friend} ></FriendItem>
                                    ))
                                        : ""
                                }

                            </div>
                        </div>
                        <div className="aside-right">

                            {inviteToGroup ?
                                <div className="friends-list">
                                    {
                                        (inviteToGroup && inviteToGroup.length !== 0) ? inviteToGroup.map((friend, index) => (
                                            <SelectedFriendItem key={index} friend={friend} ></SelectedFriendItem>
                                        ))
                                            : ""
                                    }


                                </div>
                                : <p>0 friends selected</p>
                            }

                        </div>
                    </div>
                    <div className="upperline"></div>
                    <div className="invite-friend-modal-footer">
                        <Button type="submit" className="fb-blue save" onClick={() => { dispatch(clearInvitationGroup()); onCancel("cancel") }}>
                            Cancel
                        </Button>
                        <Button 
                        type="submit" 
                        onClick={() => { handleSendInvitation() }}>
                            Send Invitation
                        </Button>
                    </div>
                </div >
            </ModalBox>
        </ModalWrapper>
    )
}
export default InviteToGroupModal