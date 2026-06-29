import ModalWrapper from "../../modalComponents/ModalWrapper.jsx";
import ModalClose from "../../modalComponents/ModalClose.jsx";
import ModalBox from "../../modalComponents/ModalBox.jsx";
import {useSelector} from "react-redux";

import CommentItem from "./CommentItem.jsx";
import CreateComment from "./CreateComment.jsx";
import PropTypes from "prop-types";
import './Comments.scss'

const CommentsModal = ({postId, isOpen, onClose}) => {

    const commentsList = useSelector((state) => state.comments.commentsList);

    return (
        <>
            {
                isOpen && (
                    <ModalWrapper onClick={onClose}>
                        <ModalBox className="modal-comments">
                            <ModalClose onClick={onClose}/>
                            <div className="create-comment-box">
                                <CreateComment
                                    postId={postId}
                                />
                            </div>
                            <div className="comments-list">
                                {commentsList.map((comment) => (
                                    <CommentItem profile_photo=""
                                                 commentId={comment.id}
                                                 id={comment.userId}
                                                 key={comment.id}
                                                 text={comment.comment}
                                    />
                                ))}
                            </div>
                        </ModalBox>
                    </ModalWrapper>
                )
            }
        </>
    )
}
CommentsModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    postId: PropTypes.number,
}

export default CommentsModal;