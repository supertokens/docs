import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

import "../question/question.css";

type Option = {
  title: string;
  activeText?: string;
  value: string;
};

export function Question(
  props: PropsWithChildren<{
    question: string | (() => JSX.Element);
    options: Option[];
    value?: string;
    onChange?: (title: string) => void;
  }>,
) {
  return (
    <>
      <div className="question-box">
        <div className="question-box-text">
          {typeof props.question === "string"
            ? props.question
            : props.question()}
        </div>
        <div className="question-box-answers">
          {props.options.map((opt) => (
            <Answer
              key={opt.value}
              title={opt.title}
              isSelected={opt.value === props.value}
              onClick={() => {
                if (props.onChange !== undefined) {
                  props.onChange(opt.value);
                }
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

type AnswerProps = {
  title: string;
  isSelected: boolean;
  onClick?: () => void;
};

export function Answer(props: PropsWithChildren<AnswerProps>) {
  const [isMouseHover, setMouseHover] = useState(false);

  return (
    <span
      className="question-box-answer"
      onClick={props.onClick}
      data-is-selected={props.isSelected}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {props.title}
    </span>
  );
}

