import PropTypes from "prop-types";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import './FeedComponent.scss'
import { getUserIdFromToken } from "../../helpers/userIdFromAccessToken";
import PhotoAvaDefault from "/images/user_profile/photo_ava_default.png";
import {checkPath} from "../../helpers/checkPath.js"

const CreateFeed = ({createPost}) => {
    const [postText, setPostText] = useState("");
    const [files, setFiles] = useState([]);
    const dispatch = useDispatch();
    const userId = getUserIdFromToken();
    const baseURL = import.meta.env.VITE_HEAD_URL;
    const avatars = useSelector((state) => state.avatar.avatars);
    const avatarUser = `${baseURL}${avatars[userId]}`

    let { id } = useParams();

    const handlePostText = (event) => {
        event.preventDefault();
        setPostText(event.target.value);
    }
    const handleFileChange = (event) => {
        event.preventDefault();
        let newArray = files;
        newArray.push(event.target.files[0])
        setFiles(newArray);
    }

    // UserId доставать из localStorage
    const handleCreatePost = (event) => {
        event.preventDefault()
        if (id) {
            dispatch(createPost({ groupId: id, userId: userId, postText: postText, files: files }));
        } else {
            dispatch(createPost({ userId: userId, postText: postText, files: files }));
        }
        setPostText('');
        setFiles(null);
    }
    return (
        <>
            <form type="submit" className="create-post">
                <div className="layer1">
                    <div className="create-post_box">
                        <img src={ checkPath(avatarUser) ? avatarUser : PhotoAvaDefault}
                        // {avatarUser} 

                        alt="prof_photo" className="create-post_box__img"/>
                    </div>
                    <div className="create-post_comment">
                        <input
                            type="text"
                            className="create-post_comment__input"
                            value={postText}
                            onChange={handlePostText}
                        />
                    </div>
                </div>
                <div className="layer2">
                    <div className="create-post_files">
                        <label className="create-post_files__label">
                            Upload Image
                            <input
                                type="file"
                                className="create-post_files__label-input"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                    <div type="submit" className="create-post_submit">
                        <button
                            className="create-post_submit__btn"
                            onClick={handleCreatePost}>
                            Create Post
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
    createPost: PropTypes.func,
};