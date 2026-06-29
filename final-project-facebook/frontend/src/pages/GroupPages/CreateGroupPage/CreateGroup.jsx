import React, { useState } from "react";
import "./CreateGroup.scss";
import DesktopIcon from "../../../icons/desktop.svg?react";
import MobileIcon from "../../../icons/mobile.svg?react";
import EarthIcon from "../../../icons/earth.svg?react";
import LockIcon from "../../../icons/lock.svg?react";
import EyeIcon from "../../../icons/eye.svg?react";
import UserIcon from "../../../icons/user-circle.svg?react";
import FotoVideoIcon from "../../../icons/photo-video.svg?react";
import UserTagIcon from "../../../icons/user.svg?react";
import EmotionIcon from "../../../icons/smiles.svg?react";
import cn from "classnames";
import PropTypes from "prop-types"

const CreateGroup = ({ name, groupType }) => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className={cn("create-group", { "mobile-groups": isMobile })}>
      <div className="create-group__version-wrapper">
        <h3 className="create-group__version-title">Desktop Preview</h3>
        <div className="create-group__icon-wrapper">
          <span
            onClick={() => setIsMobile(false)}
            className="create-group__version-icon"
          >
            <DesktopIcon />
          </span>
          <span
            onClick={() => setIsMobile(true)}
            className="create-group__version-icon"
          >
            <MobileIcon />
          </span>
        </div>
      </div>
      <div className="group-create-scroll">
        <img
          className="create-group__img"
          src="/images/group/groups-default-cover-photo-2x.png"
          alt=""
        ></img>
        <div className="create-group__title-wrapper">
          <p className="create-group__title">{name}</p>
          <div className="create-group__small-wrapper">
            {groupType === "Private" ? (
              <>
                <LockIcon className="icon-small" />
                <span className="create-group__type-group">Private group</span>
              </>
            ) : (
              <>
                <EarthIcon className="icon-small" />
                <span className="create-group__type-group">Public group</span>
              </>
            )}
            <span className="create-group__members">1 member</span>
          </div>
          <div className="create-group__hr" />
        </div>
        <nav className= {isMobile ? `create-group__nav-mobile` : `create-group__nav`}>
          <ul className="create-group__nav-list">
            <li className="create-group__nav-item">About</li>
            <li className="create-group__nav-item">Posts</li>
            <li className="create-group__nav-item">Members</li>
            <li className="create-group__nav-item">Events</li>
          </ul>
        </nav>
        <div className={cn("create-group__info-wrapper", { "create-group-mobile": isMobile })}>
          <div className={cn("create-group__feed", { "create-group-mobile-item": isMobile })}>
            <div className="create-group__input-wrapper">
              <UserIcon />
              <input
                disabled
                className="create-group__input"
                placeholder="What's on your mind?"
              />
            </div>
            <ul className={isMobile ? `feed-list-create-group-mobile` : `feed-list-create-group`}>
              <li className="feed-item">
                <FotoVideoIcon />
                <p>Photo/video</p>
              </li>
              <li className="feed-item">
                <UserTagIcon />
                <p>Tag people</p>
              </li>
              <li className="feed-item">
                <EmotionIcon />
                <p>Feeling/activity</p>
              </li>
            </ul>
          </div>
          <div className={cn("create-group__info", { "create-group-mobile-item": isMobile })}>
            <p className="create-group__about">About</p>
            <div className="create-group__type-wrapper">
              <div className="create-group__type">
                <div className="create-group__type-title">
                  {groupType === "Private" ? (
                    <div className="create-grouptype">
                      <div className="create-grouptype__wrapper">
                        <LockIcon />
                        <span className="create-grouptype__name">Private</span>
                      </div>
                      <p className="create-grouptype__desc">
                        Only membrs can see who's in the group and what the post
                      </p>
                    </div>
                  ) : (
                    <div className="create-grouptype">
                      <div className="create-grouptype__wrapper">
                        <EarthIcon />
                        <span className="create-grouptype__name">Public</span>
                      </div>
                      <p className="create-grouptype__desc">
                        Anyone can see who's in the group and what the post
                      </p>
                    </div>
                  )}
                </div>
                <div className="create-grouptype">
                  <div className="create-grouptype__wrapper">
                    <EyeIcon />
                    <span className="create-grouptype__name">Visible</span>
                  </div>
                  <p className="create-grouptype__desc">
                    Anyone can find this group
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateGroup.propTypes = {
  name: PropTypes.string,
  groupType: PropTypes.string,
};

export default CreateGroup;
