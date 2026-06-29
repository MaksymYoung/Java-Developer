import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SearchInput from "../../../components/SearchInput/SearchInput";
import TitleAside from "../../../components/TitleAside/TitleAside";
import Aside from "../../../compositions/Aside/Aside";
import Feed from "../../../compositions/Feed/Feed";
import Loader from "../../../components/Loader/Loader";
import { fetchSearchGroups, joinGroup } from "../../../store/slices/groupsSlice";
import "./SearchGroupPage.scss";
import SearchItem from "./SearchItem";
import { jwtDecode } from "jwt-decode";

const SearchGroupPage = () => {
  const location = useLocation();
  const receivedInputValue = location.state?.inputValue || "";
  const [inputValue, setInputValue] = useState(receivedInputValue);
  const userId = jwtDecode(localStorage.getItem('accessToken')).userId;
  const { searchGroups, message, status } = useSelector((state) => state.groups);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { 
    dispatch(fetchSearchGroups(inputValue));
  }, [dispatch, inputValue]);

  const handeJoinGroup = ({ groupId, userId }) => {
    dispatch(joinGroup({ groupId, userId }));
  };

  const handleVisit = (groupId) => {
    navigate(`/groups/${groupId}`);
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setInputValue(event.target.value);
    }
  };

  return (
    <div className="search-group-page-wrapper">
      <Aside className="search-group-aside">
        <TitleAside className="search-group-aside__title">Groups</TitleAside>
        <SearchInput
          type="text"
          name="group-search"
          placeholder={inputValue}
          onKeyPress={handleKeyPress}
        />
      </Aside>
      <Feed className="search-group-main">
        {status === 'loading' && (
          <Loader />
        )}
        {searchGroups?.length > 0 ? (
          searchGroups.map((group) => {
            return (
            <SearchItem 
            key={group.id} 
            {...group}
            onJoinGroup={() => handeJoinGroup({groupId: group.id, userId: userId})}
            onVisit={() => handleVisit(group.id)}
             />
        )
          })
        ) : (
          <p className="search-group-message">{message}</p>
        )}
      </Feed>
    </div>
  );
};

export default SearchGroupPage;
