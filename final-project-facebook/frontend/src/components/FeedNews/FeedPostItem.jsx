import PropTypes from "prop-types";
import Like from '../../icons/like.svg?react'
import Comment from '../../icons/comment.svg?react'
import Forward from '../../icons/forward.svg?react'
import ThreeDotsIcon from "../../icons/chats/three-dots-horizontal.svg?react";
import {useEffect, useState} from "react";
import axiosInstance from "../../helpers/axiosInstance.js";
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken";
import CommentsModal from "./Comments/CommentsModal.jsx";
import {fetchAllCommentsFeed} from "../../store/slices/commentSlice.js";
import {useDispatch, useSelector} from "react-redux";
import FeedGallery from "./FeedGallery/FeedGallery.jsx";
import {actionGetAllAvatars} from "../../store/slices/avatarSlice.js";

const FeedPostItem = (props) => {

    const {
        onDelete,
        creator,
        img_path,
        post_text,
        datetime,
        id
    } = props

    const baseURL = import.meta.env.VITE_HEAD_URL;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [likeCount, setLikeCount] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUseruserLastName] = useState("");
    const userId = getUserIdFromToken();
    const dispatch = useDispatch();
    const avatars = useSelector((state) => state.avatar.avatars);
    const avatarUser = `${baseURL}${avatars[creator]}`

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleEditClick = () => {
        setDropdownOpen(false);
        console.log("Edit post")
    };

    const handleDeleteClick = (id) => {
        setDropdownOpen(false);
        onDelete(id);
    };
    const handleAvatarsPosts = (id) => {
        if (!avatars[id]) {
            dispatch(actionGetAllAvatars({ userId: id }));
        }
    }

    const handleCommentModal = async () => {
        await dispatch(fetchAllCommentsFeed(id));
        setIsModalOpen(!isModalOpen);
    }

    useEffect(() => {
        let isMounted = true;
        handleAvatarsPosts(creator);
        const getUserData = async () => {
            try {
                if (creator > 1) {
                    const response = await axiosInstance.get(`${baseURL}/api/v1/users/${creator}`);
                    if (isMounted) {
                        setUserFirstName(response.data.firstName);
                        setUseruserLastName(response.data.lastName);
                    }
                } else {
                    if (isMounted) {
                        setUserFirstName("Unknown");
                        setUseruserLastName("User");
                    }
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error GETTING UserData for comment:', {
                        message: error.message,
                        status: error.response?.status,
                        data: error.response?.data,
                        config: error.config,
                    });
                }
            }

        }

        getUserData();


        const fetchLikesCount = async () => {
            try {
                const response = await axiosInstance.get(`${baseURL}/api/v1/likes/feed/count`, {
                    params: {
                        feedId: id,
                    }
                });

                if (isMounted) {
                    setLikeCount(response.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error GETTING like:', {
                        message: error.message,
                        status: error.response?.status,
                        data: error.response?.data,
                        config: error.config,
                    });
                }
            }
        };

        fetchLikesCount();

        return () => {
            isMounted = false;
        };
    }, [id]);


    const handleAddLike = async () => {
        try {
            await axiosInstance.post(`${baseURL}/api/v1/likes/feed`, null, {
                params: {
                    feedId: id,
                    userId: userId,
                },
            });

            setLikeCount((prevCount) => prevCount + 1);
            setIsLiked(true);
        } catch (error) {
            if (error.response.data === "User has already liked this feed") {
                await handleRemoveLike()
            }
        }
    };

    const handleRemoveLike = async () => {
        try {
            await axiosInstance.delete(`${baseURL}/api/v1/likes/feed`, {
                params: {
                    feedId: id,
                    userId: userId,
                },
            });

            setLikeCount((prevCount) => prevCount - 1);
            setIsLiked(false);
        } catch (error) {
            console.error('Error REMOVING like:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config,
            });
        }
    };

    return (
        <>
            <div className="feed-card">
                <div className="feed-profile">
                    <img src={avatarUser ? avatarUser : '/images/user_profile/photo_ava_default.png'} alt="prof_photo" className="feed-profile__img"/>
                    <div className="feed-profile_box">
                        <a href={`/profile-friend/${creator}`} className="feed-profile__fullname">
                            {userFirstName + " " + userLastName}
                        </a>
                        <p className="feed-profile__datetime">
                            {datetime}
                        </p>
                    </div>
                    {creator == userId ? (
                        <div className="feed-profile__edit">
                            <button
                                className={"fb-button fb-gray"}
                                onClick={handleDropdownToggle}
                            >
                                <ThreeDotsIcon/>
                            </button>

                            {dropdownOpen && (
                                <div className="post_dropdown-menu">
                                    <button className="fb-button fb-gray" onClick={handleEditClick}>
                                        Edit Post
                                    </button>
                                    <button className="fb-button fb-gray" onClick={() => handleDeleteClick(id)}>
                                        Delete Post
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (<>
                    </>)}
                </div>
                <div className="feed-content">
                    {img_path[0] ? (
                        <div className="feed-content__wrapper">
                            <p className="feed-content__wrapper_text">
                                {post_text}
                            </p>
                            <FeedGallery imagesList={img_path} imageLink={`${baseURL}`}/>
                        </div>
                    ) : (
                        <div className="feed-content__wrapper">
                            <p className="feed-content__wrapper_text">
                                {post_text}
                            </p>
                        </div>
                    )}
                </div>
                <div className="reactions-box">
                    <div className="reactions-box__buttons">
                        <button
                            className="reactions-box__buttons_btn reactions-box__like"
                            onClick={isLiked ? handleRemoveLike : handleAddLike}
                        >
                            <Like className="reactions-box_ico"/>
                            {likeCount > 1000 ? (`${likeCount / 1000}k`) : (likeCount)} {isLiked ? 'Unlike' : 'Like'}
                        </button>
                        <button onClick={handleCommentModal} className="reactions-box__buttons_btn reactions-box__like"><Comment
                            className="reactions-box_ico"/>Comment
                        </button>
                        <button onClick={() => console.log("postId: ", id)}
                                className="reactions-box__buttons_btn reactions-box__comment"><Forward
                            className="reactions-box_ico"/>Share
                        </button>
                    </div>
                </div>
            </div>

            <CommentsModal
                postId={id}
                isOpen={isModalOpen}
                onClose={handleCommentModal}
            />
        </>
    )
}

export default FeedPostItem;

FeedPostItem.propTypes = {
    children: PropTypes.any,
    creator: PropTypes.number,
    datetime: PropTypes.string,
    img_path: PropTypes.array,
    post_text: PropTypes.string,
    profile_photo: PropTypes.string,
    onDelete: PropTypes.func,
    id: PropTypes.number,
};