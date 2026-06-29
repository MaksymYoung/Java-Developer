import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../../Loader/Loader";
import "./GroupDiscover.scss";
import GroupDiscoverItem from "./GroupDiscoverItem";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroups,
  fetchUserGroups,
  fetchMoreGroups,
  joinGroup,
  requestJoinPrivatGroup,
  getGroupJoinPending,
} from "../../../store/slices/groupsSlice";
import { useNavigate } from "react-router-dom";

const GroupDiscover = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groups, userId, status, hasMore, index } = useSelector(
    (state) => state.groups
  );

  const { pendingGroups } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(getGroupJoinPending());
  }, []);

  const handeJoinGroup = ({ groupId, userId }) => {
    dispatch(joinGroup({ groupId, userId }));
  };

  const joinPrivatGroup = (id) => {
    dispatch(requestJoinPrivatGroup({ groupId: id }));
  };

  const handleVisitGroup = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  useEffect(() => {
    dispatch(fetchUserGroups(userId));
    dispatch(fetchGroups());
  }, [dispatch, userId]);

  const fetchMoreData = () => {
    if (hasMore) {
      dispatch(fetchMoreGroups(index));
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <div className="group-discover" >
      <div className="group-discover__title-wrapper">
        <h4 className="group-discover__title">Suggested for you</h4>
        {/* <span className="group-discover__see-all">See all</span> */}
      </div>
      <p className="group-discover__subtitle">
        Groups you might be interested in
      </p>
      <InfiniteScroll
        className="scroll-discover"
        dataLength={groups?.length || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader className="loader-discover" />}
      >
        <ul className="discover-list">
          {groups && groups.map((group, index) => (
            <GroupDiscoverItem
              key={index}
              {...group}
              pendingGroups={pendingGroups}
              onJoinGroup={() => {
                handeJoinGroup({ userId: userId, groupId: group.id });
              }}
              onJoinPrivatGroup={(id) => {
                joinPrivatGroup(id);
              }}
              onVistGroup={() => handleVisitGroup(group.id)}
            />
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default GroupDiscover;
