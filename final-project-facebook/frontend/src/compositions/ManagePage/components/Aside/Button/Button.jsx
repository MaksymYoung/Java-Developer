import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import "./Button.scss";

const Button = (props) => {
    const { className, children, isActive, ...restProps } = props;

    return (
        <>
            <div className='button-wrapper'>
                <button onClick={()=> isActive()} type="button" className={cn('button', className)} {...restProps}>
                    {children}
                </button>
                <div className={cn('under-line', className)}></div>
                
            </div>
        </>
    );
};
Button.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    restProps: PropTypes.object,
  }
export default Button;