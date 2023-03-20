import React, {useState, useEffect} from "react";
import "./recipeBox.css"

type size = "small" | "large"

export default function AuthMode(props: { text: string, size: size, path: string, icon: string, img?: string }) {
    const [image, setImage] = useState({default: ""});
    const [imageOnHover, setImageOnHover] = useState({default: ""});
    const [imageToShow, setImageToShow] = useState({default: ""});
    const [hover, setHover] = useState(false);
    useEffect(() => {
        setImage(require(`../../../static/img/guides/${props.icon}.svg`));
        setImageOnHover(require(`../../../static/img/guides/${props.icon}-orange.svg`));
        if(props.size == "large" && props.img) {
            setImageToShow(require(`../../../static/img/guides/${props.img}.png`))
        }
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
        <div className="recipe_box__full_image">
            <img src={`/img/guides/${props.img}.png`} alt="preview of pre-built UI" />
        </div>
    </a>
}