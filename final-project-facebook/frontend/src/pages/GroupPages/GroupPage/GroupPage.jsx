import React, { useEffect, useRef, useState } from "react";
import "./GroupPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteGroup,
  fetchGroupById,
  joinGroup,
  leaveGroup,
  fetchImageGroup,
} from "../../../store/slices/groupsSlice";
import { allFriends } from "../../../store/slices/friendSlice";
import { Button } from "../../../components/Buttons";
import PlusIcon from "../../../icons/plus-icon.svg?react";
import ShareIcon from "../../../icons/share-icon.svg?react";
import DownArrowFilledIcon from "../../../icons/down-arrow-filled.svg?react";
import DownArrowLineIcon from "../../../icons/down-arrow-line.svg?react";
import GroupIcon from "../../../icons/group-v2.svg?react";
import SearchIcon from "../../../icons/search.svg?react";
import ThreeDotsIcon from "../../../icons/chats/three-dots-horizontal.svg?react";
import EarthIcon from "../../../icons/earth.svg?react";
import LockIcon from "../../../icons/lock.svg?react";
import Discussion from "./Discussion/Discussion";
import DropDown from "../../../components/DropDownForButtons/DropDown";
import DropDownItem from "../../../components/DropDownForButtons/DropDownItem";
import Bell from "../../../icons/bell-outline.svg?react";
import Unfollow from "../../../icons/unfollow.svg?react";
import Leave from "../../../icons/leave.svg?react";
import { useClickOutside } from "../../../helpers/useClickOutside";
import PencilIcon from "../../../icons/pencil-icon.svg?react";
import UploadFotoIcon from "../../../icons/upload-photo.svg?react";
import GroupsIcon from "../../../icons/group-v2.svg?react";
import ContentIcon from "../../../icons/content.svg?react";
import InviteToGroupModal from "../../../components/GroupsComponents/InviteToGroup/InviteToGroupModal";
import UnderConstructionNoButton from "../../UnderConstruction/UnderConstructionNoButton";
import GroupMembers from "./Members/GroupMembers";
import { clearInvitationGroup } from "../../../store/slices/inviteFriendToGroup"
import { jwtDecode } from "jwt-decode";
import GroupAbout from "./GroupAbout/GroupAbout";
import imageGroupIcon from "/images/group/groups-default-cover-photo-2x.png";

const GroupPage = (props) => {
  const IMG_URL = import.meta.env.VITE_GROUP_IMG_URL;
  const dispatch = useDispatch();
  const { id } = useParams();
  const {onMembers, onshowMembers} = props;
  const { group } = useSelector((state) => state.groups);
  const { members } = useSelector((state) => state.groups.group);
  const userId = jwtDecode(localStorage.getItem("accessToken"))?.userId;
  const [isInGroup, setIsInGroup] = useState(false);
  const navigate = useNavigate();
  const [pageNavigate, setPageNavigate] = useState("");

  const isOwner = group.ownerId === userId ? true : false;

  useEffect(() => {
    setPageNavigate(onMembers)
}, [onMembers])

  useEffect(() => {
    if (group && group.members && group.members.includes(userId)) {
      setIsInGroup(true);
    } else {
      setIsInGroup(false);
    }
  }, [group, userId]);

  const [dropDown, setDropDown] = useState(false);
  const [dropDownOwn, setDropDownOwn] = useState(false);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      dispatch(fetchImageGroup({ id, formData }))
    }
  };

  const dropDownRef = useRef(null);
  const dropDownEditRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropDownOwnRef = useRef(null);
  useClickOutside(dropDownRef, () => setDropDown(false));
  useClickOutside(dropDownEditRef, () => setDropDown(false));
  useClickOutside(dropDownOwnRef, () => setDropDownOwn(false));

  useEffect(() => {
    dispatch(fetchGroupById(id));
  }, [dispatch, id]);

  const handleLeaveGroup = (groupId) => {
    dispatch(leaveGroup(groupId));
    setIsInGroup(false);
  };

  const handleDeleteGroup = (groupId) => {
    dispatch(deleteGroup(groupId));
  };

  const handleJoinGroup = ({ groupId, userId }) => {
    dispatch(joinGroup({ groupId, userId }));
    setIsInGroup(true);
  };


  const handleAddGroupImage = () => {
    dispatch(addGroupImage({ groupId: id, selectedFile }));
  };
  const handleAllFriends = () => { dispatch(allFriends()) };
  const [invite, setInvite] = useState(false)
  const handleInviteFriend = () => {
    handleAllFriends();
    setInvite(true);
  }
  const [activeElement, setActiveElement] = useState("");
  const btnActive = (section) => {
    setActiveElement(section)
  };

  const cancel = (btncancel) => {
    if (btncancel === "cancel") {
      setActiveElement("")
      setInvite(false)
    }
  }

  const escKey = (event) => {
    if (event.key === "Escape") {
      return dispatch(clearInvitationGroup()), setInvite(false);
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', escKey);
    return
  }, [])

  const handleNavigation = ((button, event) => {
    setPageNavigate(button);
  })



  return (
    <div className="group-page-wrapper">
      <div className="group-page-header">
        <div className="group-page-header__img-link">
          <img
            className="group-page-header__img"
            src={
              group.coverImageUrl === ""
                ? imageGroupIcon
                : `${IMG_URL}/groups/${group.coverImageUrl}`
            }
            alt={group.name}
          />
          {isOwner && (
            <div ref={dropDownEditRef} className="group-page-header__edit">
              <Button
                className="btn-edit-group"
                onClick={() => {
                  setDropDown(!dropDown);
                }}
              >
                <PencilIcon />
                <span className="btn-edit-group__text">Edit</span>
              </Button>
              {dropDown && (
                <DropDown>
                  <DropDownItem
                    name="Upload photo"
                    icon={<UploadFotoIcon />}
                    onClick={() => {
                      fileInputRef.current.click();
                      setDropDown(false);
                    }}
                  ></DropDownItem>
                </DropDown>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="input-file"
                onChange={handleFileUpload}
              />
            </div>
          )}
        </div>

        <div className="group-page-header__info-wrapper">
          <h2 className="group-page-header__title">{group.name}</h2>
          <div className="group-page-header__info">
            <div className="group-page-header__desc-wrapper">
              <div className="group-page-header__desc">
                <div className="group-page-header__type">
                  {group.groupType === "PRIVATE" ? (
                    <div className="type">
                      <LockIcon /> <span>Private group</span>
                    </div>
                  ) : (
                    <div className="type">
                      <EarthIcon /> <span>Public group</span>
                    </div>
                  )}
                </div>
                <div className="group-page-header__members" onClick={() => { handleNavigation("People") }} >
                  {members?.length} members
                </div>
              </div>
              {/* <div className="group-page-header__members-img"></div> */}
            </div>
            <div className="group-page-header__actions">

              {isOwner ?
                <>
                  {invite ? <InviteToGroupModal onCancel={cancel} />
                    :
                    <Button onClick={() => { handleInviteFriend() }}>
                      <PlusIcon />
                      <span>Invite friends</span>
                    </Button>
                  }
                </>
                : ""
              }

              {isInGroup && !isOwner && (
                <>
                  {invite ? <InviteToGroupModal onCancel={cancel} />
                    :
                    <Button onClick={() => { handleInviteFriend() }}>
                      <PlusIcon />
                      <span>Invite friends</span>
                    </Button>
                  }
                  <Button className={"fb-gray"}>
                    <ShareIcon />
                    <span>Share</span>
                  </Button>
                  <div ref={dropDownRef} className="group-page-header__joined">
                    <Button
                      className={"fb-gray"}
                      onClick={() => setDropDown(!dropDown)}
                    >
                      <GroupIcon />
                      <span>Joined</span>
                      <DownArrowFilledIcon className="downArrow-filled" />
                    </Button>
                    {dropDown && (
                      <DropDown>
                        <DropDownItem
                          name="Manage notification"
                          icon={<Bell />}
                        />
                        <DropDownItem
                          name="Unfollow group"
                          icon={<Unfollow />}
                        />
                        <DropDownItem
                          name="Leave group"
                          icon={<Leave />}
                          onClick={() => {
                            handleLeaveGroup(group.id);
                            setDropDown(false);
                          }}
                        />
                      </DropDown>
                    )}
                  </div>
                  {/* <Button className={"fb-gray"}>
                    <DownArrowLineIcon />
                  </Button> */}
                </>
              )}

              {!isInGroup && !isOwner && (
                <>
                  <Button onClick={() => handleJoinGroup({ groupId: group.id, userId: userId })}>
                    <GroupsIcon />
                    <span>Join group</span>
                  </Button>
                  <Button className={"fb-gray"}>
                    <ShareIcon />
                    <span>Share</span>
                  </Button>
                  <Button className={"fb-gray"}>
                    <DownArrowLineIcon />
                  </Button>
                </>
              )}
            </div>
          </div>
          <nav className="group-page-header__nav">
            <ul className="group-page-header__nav-list">
              <li className={`group-page-header__nav-link ${pageNavigate === "About" ? "group-nav-active" : ""}`}
              onClick={() => { handleNavigation("About") }}
              >
                  About
              </li>
              <li className={`group-page-header__nav-link ${pageNavigate === "Discussion" || pageNavigate === "" ? "group-nav-active" : ""}`}
              onClick={() => { handleNavigation("Discussion") }}
              >
                  Discussion
              </li>
              <li className={`group-page-header__nav-link ${pageNavigate === "People" ? "group-nav-active" : ""}`}
                  onClick={() => { handleNavigation("People") }}
              >
                  People
              </li>
              <li className={`group-page-header__nav-link ${pageNavigate === "Events" ? "group-nav-active" : ""}`}
                  onClick={() => { handleNavigation("Events") }}
                  >
                  Events
              </li>
              <li className={`group-page-header__nav-link ${pageNavigate === "Media" ? "group-nav-active" : ""}`}
                  onClick={() => { handleNavigation("Media") }}
                  >
                  Media
              </li>
              <li className={`group-page-header__nav-link ${pageNavigate === "Files" ? "group-nav-active" : ""}`}
                  onClick={() => { handleNavigation("Files") }}
                  >
                  Files
              </li>
            </ul>
            <div className="group-page-header__nav-btn">
              {/* <Button className={"fb-gray"}>
                <SearchIcon />
              </Button> */}
              <div
                ref={dropDownOwnRef}
                className="group-page-header__three-dots"
              >
                <Button
                  className={"fb-gray"}
                  onClick={() => setDropDownOwn(!dropDownOwn)}
                >
                  <ThreeDotsIcon />
                </Button>
                {dropDownOwn && (
                  <DropDown className="three-dots-dropdown">
                    {isOwner ? (
                      <DropDownItem
                        name="Delete group"
                        icon={<Leave />}
                        onClick={() => {
                          handleDeleteGroup(group.id);
                          setDropDownOwn(false);
                          navigate("/groups/discover");
                        }}
                      />
                    ) : (
                      <DropDownItem
                        name="Your content"
                        icon={<ContentIcon />}
                      />
                    )}
                  </DropDown>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
      {pageNavigate === "About"
        ?
        <div className="group-page-main">
          <GroupAbout group={group} />
        </div>
        : ""}
      {pageNavigate === "Discussion" || pageNavigate === ""
        ?
        <div className="group-page-main">
          <Discussion group={group} />
        </div>
        : ""}
      {pageNavigate === "People"
        ?
        <div className="group-page-main">
          <GroupMembers members={members} userId={userId} groupId={id}>People</GroupMembers>
        </div>
        : ""}
      {pageNavigate === "Events"
        ?
        <div className="group-page-main">
          <UnderConstructionNoButton />
        </div>
        : ""}
      {pageNavigate === "Media"
        ?
        <div className="group-page-main">
          <UnderConstructionNoButton />
        </div>
        : ""}
      {pageNavigate === "Files"
        ?
        <div className="group-page-main">
          <UnderConstructionNoButton />
        </div>
        : ""}
    </div>
  );
};

export default GroupPage;