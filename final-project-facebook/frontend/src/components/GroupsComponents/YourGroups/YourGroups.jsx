import React, { useEffect, useRef } from "react";
import "./YourGroups.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserGroups } from "../../../store/slices/groupsSlice";
import YourGroupsItem from "./YourGroupsItem.jsx";
import { useNavigate } from "react-router-dom";

const YourGroups = () => {
  const dispatch = useDispatch();
  const { userGroups } = useSelector((state) => state.groups);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, []);
  const handleNavigate = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="your-groups">
      <div className="your-groups__title-wrapper">
        <h4 className="your-groups__title">
          All groups you've joined ({userGroups?.length})
        </h4>
        {/* <span className="your-groups__see-all">Sort</span> */}
      </div>
      <ul className="your-groups-list">
        {userGroups &&
          userGroups.map((group, index) => (
            <YourGroupsItem
              key={index}
              {...group}
              onNavigate={() => handleNavigate(group.id)}
            />
          ))}
      </ul>
    </div>
  );
};

export default YourGroups;
