import InfiniteScroll from "react-infinite-scroll-component";
import FeedPostItem from "./FeedPostItem.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import CreateFeed from "./CreateFeed.jsx";
import PropTypes from "prop-types";
import "./FeedComponent.scss"
import { useDispatch } from "react-redux";
import FeedGallery from "./FeedGallery/FeedGallery.jsx";

const FeedWrapper = ({
    elementsList,
    hasMore,
    status,
    createPost,
    fetchMoreData,
    onDelete,
}) => {
    const dispatch = useDispatch();

    const handleDeletePost = (postId) => {
        dispatch(onDelete(postId));
    }

    if (status === 'loading' && elementsList.length === 0) {
        return <Loader />;
    }

    return (
        <>
            <InfiniteScroll
                className="scroll-feed"
                dataLength={elementsList.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<Loader />}
            >
                <div className="feed-list">
                    {createPost ? (
                        <CreateFeed
                            createPost={createPost}
                        />
                    ) : (
                        <></>
                    )
                    }
                </div>
                <div className='feed-container'>
                    <div className='feed-list'>
                        {elementsList.length > 0 ?
                            elementsList.map((item, index) => (
                                <FeedPostItem creator={item.userId}
                                    datetime={item.postDate}
                                    post_text={item.content}
                                    img_path={item.images}
                                    key={index}
                                    id={item.id}
                                    onDelete={handleDeletePost}
                                />
                            )) : (
                                <div className="feed-card">
                                    <div className="feed-content">
                                        <div className="feed-content__wrapper">
                                            <p className="feed-content__wrapper_text">
                                                Welcome to Facebook! We are glad to see you here!!
                                            </p>
                                            <FeedGallery imagesList={["/images/noposts/no-friends.jpg"]} imageLink={``}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
};

FeedWrapper.propTypes = {
    elementsList: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    hasMore: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    createPost: PropTypes.func,
    fetchMoreData: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default FeedWrapper;