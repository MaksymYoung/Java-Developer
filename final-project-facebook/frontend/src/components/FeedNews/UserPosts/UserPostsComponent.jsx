import FeedWrapper from "../FeedWrapper.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createUserPost,
  deleteUserPost,
  fetchFirstUserPosts,
  fetchMoreUserPosts,
} from "../../../store/slices/userPostSlice.js";

const UserPostsComponent = () => {
  const { userPostsList, hasMore, index, status } = useSelector(
    (state) => state.userPosts
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFirstUserPosts());
  }, [dispatch]);

  const fetchMoreData = () => {
    dispatch(fetchMoreUserPosts(index));
  };

  return (
    <>
      <FeedWrapper
        createPost={createUserPost}
        elementsList={userPostsList}
        index={index}
        status={status}
        hasMore={hasMore}
        fetchMoreData={fetchMoreData}
        onDelete={deleteUserPost}
      />
    </>
  );
};

export default UserPostsComponent;
