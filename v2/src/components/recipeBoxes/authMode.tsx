import React, {useState, useEffect} from "react";
import "./recipeBox.css"

type size = "small" | "large"

export default function AuthMode(props: { text: string, size: size, path: string, icon: string, img?: string }) {
    const [image, setImage] = useState({default: ""});
    const [imageOnHover, setImageOnHover] = useState({default: ""});
    const [hover, setHover] = useState(false);
    useEffect(() => {
        setImage(require(`../../../static/img/guides/${props.icon}.svg`));
        setImageOnHover(require(`../../../static/img/guides/${props.icon}-orange.svg`));
    }, [props.size]);

    const handleMouseOver = () => {
        setHover(true);
    }
    const handleMouseOut = () => {
        setHover(false);
    }

    return <a href={props.path} className={`recipe_box ${props.size}`} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <div className="recipe_box__icon_wrapper">
            <img src={hover ? imageOnHover.default : image.default} alt="" />
        </div>
        <div className="recipe_box__text">{props.text}</div>
    </a>
}