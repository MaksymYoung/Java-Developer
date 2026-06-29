import React from "react";
import Construction from "../../icons/under-construction/under-construction-worker-svg.svg?react"
import "./UnderConstruction.scss"

const UnderConstructionNoButton = (props) => {
    return (
        <div className="under-construction-wrapper no-button">
            <Construction className="construction-icon"/>
            <div className="error-title">
                This content isn't available at the moment
            </div>
            <div className="error-text">
                Page under construction
            </div>
        </div>
    )
}

export default UnderConstructionNoButton
