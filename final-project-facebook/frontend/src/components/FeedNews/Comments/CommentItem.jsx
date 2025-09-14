import axiosInstance from "../../../helpers/axiosInstance.js";
import {useEffect, useState} from "react";
import ThreeDotsIcon from "../../../icons/chats/three-dots-horizontal.svg?react";
import {useDispatch, useSelector} from "react-redux";
import {deletePostComment} from "../../../store/slices/commentSlice.js";
import {actionGetAllAvatars} from "../../../store/slices/avatarSlice.js";

const CommentItem = ({commentId, text, id}) => {
    const baseURL = import.meta.env.VITE_HEAD_URL;
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    //const avatarUser = "/images/user_profile/photo_ava_default.png";
    const dispatch = useDispatch();

    const avatars = useSelector((state) => state.avatar.avatars);
    const avatarUser = `${baseURL}${avatars[id]}`

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const handleEditClick = () => {
        setDropdownOpen(false);
    }

    const handleDeleteClick = () => {
        dispatch(deletePostComment(commentId));
        setDropdownOpen(false);
    }

    const handleAvatarsComment = (id) => {
        if (!avatars[id]) {
            dispatch(actionGetAllAvatars({ userId: id }));
        }
    }

    useEffect(() => {
        let isMounted = true;

        handleAvatarsComment(id);
        const getUserData = async () => {
            try {
                if (id > 2) {
                    const response = await axiosInstance.get(`${baseURL}/api/v1/users/${id}`);
                    if (isMounted) {
                        setName(response.data.firstName);
                        setLastName(response.data.lastName);
                    }
                } else {
                    if (isMounted) {
                        setName("Unknown");
                        setLastName("User");
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

        return () => {
            isMounted = false;
        };
    }, [id]);
    return (
        <>
            <div className="comment-item">
                <div className="comment-item_pfp">
                    <img src={avatarUser} alt="pfp"/>
                </div>
                <div className="comment-item_text">
                    <p className="comment-item_text__username">
                        {name + " " + lastName}
                    </p>
                    <p className="comment-item_text__content">
                        {text}
                    </p>
                </div>
                <div className="comment-edit_dropdown">
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
            </div>
        </>
    )
}

export default CommentItem;