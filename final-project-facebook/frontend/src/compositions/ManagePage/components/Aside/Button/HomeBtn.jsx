import cn from "classnames";
import React from "react";
import HomeIcon from "../../../../../icons/home.svg?react"
import "../Manage/Settings.scss";


const HomeBtn = (props) => {
    const { className, children, onHome, active, onActive, ...restProps } = props;
    return (
        <>
            <div className="settings-wrapper" onClick={()=> {onHome(); onActive("manage")}}>
                <div className={cn(`settings-item-aside`, className)}>
                    <div className="home-btn-block">
                        <HomeIcon></HomeIcon>
                    <p> Community home </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeBtn;
