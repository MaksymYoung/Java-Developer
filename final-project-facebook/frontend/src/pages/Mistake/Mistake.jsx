import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Error from "../../icons/mistake/error.svg?react"
import { Button } from "../../components/Buttons";
import "./Mistake.scss"

const Mistake = (props) => {
    const navigate = useNavigate();
    return (
        <div className="mistake-wrapper">
            <div className="error-icon">
                <Error />
            </div>
            <div className="error-title">
                This content isn't available at the moment
            </div>
            <div className="error-text">
                When this happens, it's usually because the owner only shared it with a small group of people or changed who can see it, or it's been deleted.
            </div>
            <div className="error-button">
                <Button onClick={() => {navigate("/home")}}>Go to Home page</Button>
            </div>
        </div>
    )
}

export default Mistake
