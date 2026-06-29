import {useDispatch, useSelector} from "react-redux";
import FeedWrapper from "./FeedWrapper.jsx";
import {
    fetchFirstFeedPosts,
    fetchMoreFeedPosts
} from "../../store/slices/feedPostsSlice.js"
import {useEffect} from "react";
import "./FeedComponent.scss"
import {deleteFeedPost} from "../../store/slices/feedPostsSlice.js";

const FeedComponent = () => {
    const { postsList, hasMore, index, status } = useSelector((state) => state.feed);
    const dispatch = useDispatch();

    useEffect(()=> {
        dispatch(fetchFirstFeedPosts());
    }, [dispatch]);

    const fetchMoreData = () => {
        dispatch(fetchMoreFeedPosts(index));
    };

    return (
        <FeedWrapper
            elementsList={postsList}
            index={index}
            status={status}
            hasMore={hasMore}
            fetchMoreData={fetchMoreData}
            onDelete={deleteFeedPost}
        />
    )
};

export default FeedComponent;