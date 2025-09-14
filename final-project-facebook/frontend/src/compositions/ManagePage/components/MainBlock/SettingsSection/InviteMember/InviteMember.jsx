import cn from "classnames";
import React, { useState} from "react";
import { useNavigate} from "react-router-dom";
import Button from "../../../../../../components/Buttons/Button/Button";
import { useDispatch, useSelector } from "react-redux";

import ModalWrapper from "../../../../../../components/modalComponents/ModalWrapper";
import ModalBox from "../../../../../../components/modalComponents/ModalBox";
import SearchInput from "../../../../../../components/SearchInput/SearchInput";
import Close from "../../../../../../icons/cross.svg?react"
import FriendIcon from "../../../../../../icons/friends/friend-fill.svg?react"
import Square from "../../../../../../icons/check/square.svg?react"
import Check from "../../../../../../icons/check/check.svg?react"
import "./InviteMember.scss";

const InviteMember = (props) => {
    const { className, onCancel, ...restProps } = props;

    const friends = useSelector((state) => state.friend.allFriends);
    const [selected, setSelected] = useState(false);
    const handleSeledted = () => {
        return !selected ? setSelected(true) : setSelected(false)
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSendInvitation = () => {
    }

    return (
        <ModalWrapper onClick={() => { onCancel("cancel") }}>
            <ModalBox className={"modal-box"}>
                <div className={cn("invite-friend-modal-wrapper", className)}>
                    <div className="invite-friend-modal-header">
                        <p>Invite friends to this group</p>
                        <div className={"close-icon-wrapper"} onClick={() => { onCancel("cancel") }}>
                            <Close className={"close-icon"} />
                        </div>

                    </div>
                    <div className="underline"></div>
                    <div className="invite-friend-modal-main">
                        <div className="aside-left">
                            <div className="search">
                                <SearchInput
                                    htmlFor="group-search"
                                    type="text"
                                    name="group-search"
                                    placeholder="Search member"
                                />
                            </div>
                            <p>Suggested</p>
                            <div className="friends-list">
                                {
                                    friends && friends.length !== 0 ? friends.map((friend, index) => (
                                        <div key={index} className="friend-item-wrapper">
                                            <div className="friend-box">
                                                <div className="friend-icon">
                                                    <FriendIcon className="icon"></FriendIcon>
                                                </div>
                                                <div className="friend-item">Friend # {friend}</div>
                                            </div>

                                            <div className="selector" onClick={() => { handleSeledted() }}>
                                                {!selected ? <Square />
                                                    :
                                                    <div className="selector-check">
                                                        <Square className="square" />
                                                        <Check className="check" />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    ))
                                        : ""
                                }

                            </div>
                        </div>
                        <div className="aside-right">

                            {selected ?
                                <div className="friends-list">
                                    <div className="friend-item-wrapper">
                                        <div className="friend-box">
                                            <div className="friend-icon">
                                                <FriendIcon className="icon"></FriendIcon>
                                            </div>
                                            <div className="friend-item">Friend # </div>
                                        </div>

                                    </div>
                                </div>
                                : <p>0 friends selected</p>
                            }

                        </div>
                    </div>
                    <div className="upperline"></div>
                    <div className="invite-friend-modal-footer">
                        <Button type="submit" className="fb-blue save" onClick={() => { onCancel("cancel") }}>
                            Cancel
                        </Button>
                        <Button disabled={selected ? false : true} type="submit" className={cn(`fb-blue save ${selected ? "active" : ""}`)} onClick={() => { handleSendInvitation() }}>
                            Send Invitation
                        </Button>
                    </div>
                </div >
            </ModalBox>
        </ModalWrapper>
    )
}

export default InviteMember