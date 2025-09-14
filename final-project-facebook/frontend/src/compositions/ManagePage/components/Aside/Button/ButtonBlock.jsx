import cn from "classnames";
import React from "react";

import Button from "./Button";
import "./ButtonBlock.scss";

const ButtonBlock = (props) => {
    const { className, children, onActive, active, ...restProps } = props;
    return (
        <>
            <div className={cn('button-block')} {...restProps}>
                <div className="button-block-wrapper">
                    <Button className={active === "chats" ? 'activeBtn' : ''}
                        onClick={() => onActive("chats")}
                    >
                        Chats
                    </Button>
                    <Button className={active === "manage" ? 'activeBtn' : ''}
                        onClick={() => onActive("manage")}
                    >
                        Manage
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ButtonBlock;
