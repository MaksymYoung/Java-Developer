import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchGroupById } from "../../store/slices/groupsSlice";

import AsideBlock from "../../compositions/ManagePage/components/Aside/AsideBlock";
import ButtonBlock from "../../compositions/ManagePage/components/Aside/Button/ButtonBlock";
import GroupHeader from "../../compositions/ManagePage/components/Aside/Header/GroupHeader";

import Settings from "../../compositions/ManagePage/components/Aside/Manage/Settings";
import MainBlock from "../../compositions/ManagePage/components/MainBlock/MainBlock";
import MemberRequestSection from "../../compositions/ManagePage/components/MainBlock/MemberRequest/MemberRequestSection";
import SettingMainBlock from "../../compositions/ManagePage/components/MainBlock/SettingsSection/SettingSection";
import PageWrapper from "../../compositions/ManagePage/components/Wrapper/PageWrapper";
import "../../compositions/ManagePage/ManageGroup.scss";
import LockClose from "../../icons/lock-close.svg?react";
import EarthIcon from "../../icons/earth.svg?react"
import GroupPage from "../GroupPages/GroupPage/GroupPage";
import HomeBtn from "../../compositions/ManagePage/components/Aside/Button/HomeBtn";
import Burger from "../../components/Burger/Burger";

const ManageGroupPage = (props) => {
    const { className, ...restProps } = props;
    const { id } = useParams();
    const dispatch = useDispatch();

    const group = useSelector((state) => state.groups.group);
    useEffect(() => { dispatch(fetchGroupById(id)) }, [dispatch]);

    const [activeButton, setActiveButton] = useState("manage");
    const btnActive = (section) => {
        setActiveButton(section)
    };

    function isLock() {
        if (group.groupType === 'OPEN') {
            return <EarthIcon className="group-status-lock" />
        } else if (group.groupType === 'PRIVATE') {
            return <LockClose className="group-status-lock" />
        } else return ""
    }

    const [btnSetting, setBtnSetting] = useState("");
    const groupManage = { btnSetting, setBtnSetting, ...group };

    const home = () => {
        setBtnSetting("");
    }

    const escKey = (event) => {
        if (event.key === "Escape") {
            return setActiveElement(false);
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', escKey);
        return
    }, [])

    const [activeElement, setActiveElement] = useState(false);

    const btnActiveBurger = (e) => {
        e.stopPropagation();
        setActiveElement(prevCheck => !prevCheck)
    };

    const closeBtnActiveBurger = () => {
        setActiveElement(false);
    };

    const cancel = (btncancel) => {
        if (btncancel === "cancel") {
            setActiveElement(false)
        }
    }

    const handleResize = (event) => {
        if (event.target.innerWidth > 768) {
            setActiveElement(false)
        }
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [onMembers, setOnMembers] = useState("");
    const showMembers = (show) => {
        setOnMembers(show)
    }

    return (
        <>
            <PageWrapper>
                <AsideBlock className={`${activeElement ? "aside-active" : ""} `}
                    onActiveElement={activeElement} onCloseAside={closeBtnActiveBurger}
                >

                    <GroupHeader {...group} onLock={isLock} groupId={id} onHome={home} onshowMembers={showMembers}></GroupHeader>
                    <ButtonBlock onActive={btnActive} active={activeButton}></ButtonBlock>
                    {activeButton === "manage" ?
                        <div className={`home-button-section `}>
                            <HomeBtn
                                className={`home-btn ${!btnSetting && activeButton === "manage" ? 'activeBtn' : ''}`}
                                onActive={btnActive} active={activeButton}
                                onHome={home}
                            ></HomeBtn>
                        </div>
                        : ""
                    }
                    {activeButton === "manage" ?
                        <Settings
                            {...group}
                            onLock={isLock}
                            {...groupManage}
                        >
                        </Settings> : ""}

                </AsideBlock>
                <MainBlock className="main-nav-active">
                    <div className={`burger ${activeElement ? "burger-active" : ""} `} onMouseDown={(e) => { btnActiveBurger(e) }}>
                        <Burger   />
                    </div>

                    {btnSetting !== "" ? "" : <GroupPage id="group-page" onMembers={onMembers} onshowMembers={showMembers} />}

                    {btnSetting === "member-request" ?
                        <MemberRequestSection groupId={id}></MemberRequestSection>
                        : ""}

                    {btnSetting === "group-settings" ? <div className="manage__group-setUp">
                        <SettingMainBlock {...group} onLock={isLock}></SettingMainBlock>
                    </div> : ""}
                </MainBlock>
            </PageWrapper>
        </>
    );
};

export default ManageGroupPage;