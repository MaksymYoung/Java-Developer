import PropTypes from "prop-types";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createComment} from "../../../store/slices/commentSlice.js";
import { getUserIdFromToken } from "../../../helpers/userIdFromAccessToken.js";

const CreateFeed = ({postId}) => {
    const [commentText, setCommentText] = useState("");
    const baseURL = import.meta.env.VITE_HEAD_URL;
    const userId = getUserIdFromToken();
    const dispatch = useDispatch();

    const avatars = useSelector((state) => state.avatar.avatars);
    const avatarUser = `${baseURL}${avatars[userId]}`

    const handleCommentText = (event) => {
        setCommentText(event.target.value);
    }

    const handleCreateComment = (event) => {
        event.preventDefault()
        dispatch(createComment({ feedId: postId, userId: userId, commentText: commentText }));
    }
    return (
        <>
            <form className="create-post create-comment">
                <div className="layer1">
                    <div className="create-post_box">
                        <img src={avatarUser} alt="pfp" className="create-post_box__img"/>
                    </div>
                    <div className="create-post_comment">
                        <input
                            type="text"
                            className="create-post_comment__input"
                            value={commentText}
                            onChange={handleCommentText}
                        />
                    </div>
                </div>
                <div className="layer2">
                    <div className="create-post_submit">
                        <button
                            className="create-post_submit__btn"
                            onClick={handleCreateComment}>
                            Publish Comment
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default CreateFeed;

CreateFeed.propTypes = {
    profile_photo: PropTypes.string,
    postId: PropTypes.number,
};