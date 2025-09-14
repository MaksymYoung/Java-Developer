import React from "react";
import "./MainPrivate.scss";
import LockProtectIcon from "../../../../icons/lock-protect.svg?react";

const MainPrivate = () => {
  return (
    <div className="group-main-lock-wrapper">
      <div className="group-main-lock">
      <LockProtectIcon />
        <h3 className="group-main-lock__title">This group is private</h3>
        <p className="group-main-lock__desc">
          Join this group to view or participate in discussions.
        </p>
      </div>
    </div>
  );
};

export default MainPrivate;
