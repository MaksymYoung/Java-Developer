import FeedWrapper from "../FeedWrapper.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {
    createGroupPost,
    deleteGroupPost,
    fetchFirstGroupPosts,
    fetchMoreGroupPosts
} from "../../../store/slices/groupFeedSlice.js";
import {useParams } from 'react-router-dom';

const GroupPostsComponent = () => {
    const { groupPostsList, hasMore, index, status } = useSelector((state) => state.groupsPosts);

    const dispatch = useDispatch();
    let { id } = useParams();

    useEffect(()=> {
        dispatch(fetchFirstGroupPosts(id));
    }, [dispatch]);

    const fetchMoreData = () => {
        dispatch(fetchMoreGroupPosts(index));
    };

    return (
        <>
            <FeedWrapper
                createPost={createGroupPost}
                elementsList={groupPostsList}
                index={index}
                status={status}
                hasMore={hasMore}
                fetchMoreData={fetchMoreData}
                onDelete={deleteGroupPost}
            />
        </>
    )
}
export default GroupPostsComponent

