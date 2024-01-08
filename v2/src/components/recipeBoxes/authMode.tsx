import React, {useState } from "react";
import "./recipeBox.css"

type Size = "small" | "large"

export default function AuthMode(props: { text: string, size: Size, path: string, icon: string, img?: string }) {
    const [hover, setHover] = useState(false);
    
    const regularIconPath = `/img/guides/${props.icon}.svg`;
    const onHoverIconPath = `/img/guides/${props.icon}-orange.svg`;

    const handleMouseOver = () => {
        setHover(true);
    }
    const handleMouseOut = () => {
        setHover(false);
    }

    return <a href={props.path} className={`recipe_box ${props.size}`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <div className="recipe_box__icon_wrapper">
            <img src={hover ? onHoverIconPath : regularIconPath} alt={props.text} />
        </div>
        <div className="recipe_box__text">{props.text}</div>
        <div className="recipe_box__full_image">
            <img src={`/img/guides/${props.img}.png`} alt="preview of pre-built UI" />
        </div>
    </a>
}