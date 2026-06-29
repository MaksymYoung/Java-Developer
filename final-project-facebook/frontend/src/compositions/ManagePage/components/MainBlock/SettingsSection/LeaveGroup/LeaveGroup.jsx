import cn from "classnames";
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../../../components/Buttons/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { leaveGroup, deleteGroup } from "../../../../../../store/slices/groupsSlice";
import { useParams } from "react-router-dom";

import ModalWrapper from "../../../../../../components/modalComponents/ModalWrapper";
import ModalBox from "../../../../../../components/modalComponents/ModalBox";
import "./LeaveGroup.scss";

const LeaveGroup = (props) => {
    const { className, onClick, onCancel, ...restProps } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    let groupId = Number(id);

    const group = useSelector((state) => state.groups.group);
    const { members} = group;

    const handleSubmitDelete = async () => {
        try {
            const putResponse = await dispatch(deleteGroup(groupId));
            if (deleteGroup.fulfilled.match(putResponse)) {
                navigate("/groups/discover")
            } else {
                console.error("Change Group name and descriptions failed ", putResponse.payload);
            }
        } catch (error) {
            console.error("Change Group name and descriptions failed ", error);
        } finally {

        }
    };

    const handleSubmitLeave = async () => {
        dispatch(leaveGroup(groupId));
        navigate("/groups/discover");
    };



    return (
        <ModalWrapper onClick={() => { onCancel("cancel") }}>
            <ModalBox>
                <div className={cn("set-group-invite-wrapper", className)}>
                    <p className="item-title">Leave or delete group</p>

                    <div className="button-section">
                        <Button type="button" className="fb-blue cancel" onClick={() => { onCancel("cancel") }}>
                            Cancel
                        </Button>

                        {members.length > 1
                            ?
                            <Button type="submit" className="fb-gray save" onClick={() => { handleSubmitLeave() }}>
                                Leave group
                            </Button>
                            :
                            <Button type="submit" className="fb-gray save" onClick={() => { handleSubmitDelete() }}>
                                Delete group
                            </Button>
                        }

                    </div>
                </div >
            </ModalBox>
        </ModalWrapper>
    )
}

export default LeaveGroup