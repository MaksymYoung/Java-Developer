import React, {useEffect, useRef} from "react";
import "./Aside.scss";
import PropTypes from "prop-types";
import cn from "classnames";

function Aside(props) {
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
    <aside ref={asideRef}
      className={cn("aside-wrapper", className)}
      {...restProps}
    >
       {children}
    </aside>
  )
}

Aside.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  restProps: PropTypes.object,
}

export default Aside;
