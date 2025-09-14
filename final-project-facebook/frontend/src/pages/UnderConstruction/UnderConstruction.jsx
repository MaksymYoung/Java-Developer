import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Construction from "../../icons/under-construction/under-construction-worker-svg.svg?react"
import { Button } from "../../components/Buttons";
import "./UnderConstruction.scss"

const UnderConstruction = (props) => {
    const navigate = useNavigate();
    return (
        <div className="under-construction-wrapper" onClick={() => {navigate("/home")}}>
            <Construction className="construction-icon"/>
            <div className="error-title">
                This content isn't available at the moment
            </div>
            <div className="error-text">
                Page under construction
            </div>
            <div className="error-button">
                <Button onClick={() => {navigate("/home")}}>Go to Home page</Button>
            </div>
        </div>
    )
}

export default UnderConstruction
