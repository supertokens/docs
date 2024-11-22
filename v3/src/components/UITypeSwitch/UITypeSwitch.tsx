import { useContext } from "react";
// import { createPortal } from 'react-dom';
import { DocItemContext } from "../DocItemContext";

import "./styles.scss";

function UITypeSwitch({}) {
  const { uiType, onChangeUIType } = useContext(DocItemContext);

  return (
    <div className="ui-type-switch">
      <span>What type of UI are you using?</span>
      <button
        onClick={() => onChangeUIType("prebuilt")}
        data-is-active={uiType === "prebuilt"}
        className="ui-type-switch__button"
      >
        Pre Built UI
      </button>
      <button
        onClick={() => onChangeUIType("custom")}
        data-is-active={uiType === "custom"}
        className="ui-type-switch__button"
      >
        Custom UI
      </button>
    </div>
  );
}

function PrebuiltUIContent({ children }: React.PropsWithChildren<{}>) {
  const state = useContext(DocItemContext);

  if (state.uiType !== "prebuilt") return null;
  return children;
}

function CustomUIContent({ children }: React.PropsWithChildren<{}>) {
  const state = useContext(DocItemContext);

  if (state.uiType !== "custom") return null;
  return children;
}

export const UIType = {
  Switch: UITypeSwitch,
  PrebuiltUIContent,
  CustomUIContent,
};
