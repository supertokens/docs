import * as React from "react";
import RecipeBox from "./recipeBox";
import "./recipeLayout.css"

type guide = {
    title: string,
    path: string, 
    icon: string,
    img?: string,
}

export default function RecipeLayout(props: { guides: Array<guide>, cols: Number }) {
    return (<div className="recipe_wrapper" style={{ gridTemplateColumns: `repeat(${props.cols}, 1fr)` }}>
        {props.guides.map((ele, ind) => <RecipeBox key={ind} text={ele.title} size={props.cols == 3 ? "large" : "small"} path={ele.path} icon={ele.icon} img={ele.img} />)}
    </div>)
}