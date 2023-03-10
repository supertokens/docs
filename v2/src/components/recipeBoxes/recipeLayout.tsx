import * as React from "react";
import AuthMode from "./authMode";
import Addons from "./add_ons";
import Refs from "./refs";
import "./recipeLayout.css";
import * as guides from "./guides.json";

type mode = "auth_modes" | "add_ons" | "ref";

type guide = {
  title: string;
  path: string;
  icon: string;
  img?: string;
};

export default function RecipeLayout(props: { mode: mode }) {
  return (
    <div
      className="recipe_wrapper"
      style={{ gridTemplateColumns: `repeat(${props.mode === "auth_modes" ? 3 : 2}, 1fr)` }}
    >
      {props.mode === "auth_modes" && guides[props.mode].map((ele: guide, ind: number) => (
        <AuthMode
          key={ind}
          text={ele.title}
          size={"large"}
          path={ele.path}
          icon={ele.icon}
          img={ele.img}
        />
      ))}
      {props.mode === "add_ons" && guides[props.mode].map((ele: guide, ind: number) => (
        <Addons
          key={ind}
          text={ele.title}
          path={ele.path}
          icon={ele.icon}
          img={ele.img}
        />
      ))}
      {props.mode === "ref" && guides[props.mode].map((ele: guide, ind: number) => (
        <Refs
          key={ind}
          text={ele.title}
          path={ele.path}
          icon={ele.icon}
          img={ele.img}
        />
      ))}
    </div>
  );
}
