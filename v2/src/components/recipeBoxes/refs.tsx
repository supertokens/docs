import React, { useState } from "react";
import "./recipeBox.css"

export default function Refs(props: { text: string, path: string, icon: string, img?: string }) {
    const [hover, setHover] = useState(false);

    const regularIconPath = `/img/guides/${props.icon}.svg`;
    const onHoverIconPath = `/img/guides/${props.icon}-orange.svg`;

    const handleMouseOver = () => {
        setHover(true);
    }

    const handleMouseOut = () => {
        setHover(false);
    }

    return <a href={props.path} className={`recipe_box`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <div className="recipe_box__icon_wrapper">
            <img src={hover ? onHoverIconPath : regularIconPath} alt={props.text} />
        </div>
        <div className="recipe_box__text">{props.text}</div>
    </a>
}