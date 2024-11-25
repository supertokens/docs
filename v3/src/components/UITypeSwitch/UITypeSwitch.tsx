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

function HeadingFilter({
  children,
  name,
}: React.PropsWithChildren<{ name: string }>) {
  return <div data-heading-filter={name}>{children}</div>;
}

function PrebuiltUIContent({ children }: React.PropsWithChildren<{}>) {
  const state = useContext(DocItemContext);

  return (
    <HeadingFilter name="prebuilt">
      {state.uiType === "prebuilt" ? children : null}
    </HeadingFilter>
  );
}

function CustomUIContent({ children }: React.PropsWithChildren<{}>) {
  const state = useContext(DocItemContext);

  return (
    <HeadingFilter name="custom">
      {state.uiType === "custom" ? children : null}
    </HeadingFilter>
  );
}

export const UIType = {
  Switch: UITypeSwitch,
  PrebuiltUIContent,
  CustomUIContent,
};
