import cn from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import "./AsideBlock.scss";

const AsideBlock = (props) => {
    const { className, children, onActiveElement, onCloseAside, ...restProps } = props;
    const asideRef = useRef(null);
    const onClickOutside = (e) => {
        if (onActiveElement && asideRef.current && !asideRef.current.contains(e.target)) {
            onCloseAside(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', onClickOutside);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);

        }
    }, [onActiveElement]);

    return (
        <>
            <aside ref={asideRef} className={cn("aside-block", className)} {...restProps}>
                {children}
            </aside>
        </>
    );
};

AsideBlock.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    restProps: PropTypes.object,
}

export default AsideBlock;

