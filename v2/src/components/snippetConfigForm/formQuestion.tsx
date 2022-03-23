import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";

import "../question/question.css";

type Option = {
    title: string;
    activeText?: string;
    value: string;
};

export function Question(props: PropsWithChildren<{
    question: string | (() => JSX.Element);
    options: Option[];
    value?: string;
    onChange?: (title: string) => void;
}>) {
    const [unselected, setUnselected] = useState(false);

    let resubmitInfoClicked = (event: any) => {
        event.preventDefault();
        setUnselected(true);
    };

    if (unselected || props.value === undefined) {
        return (
            <div className="questionBox question-box">
                <div className="questionBoxText">
                    {typeof props.question === "string" ? props.question : props.question()}
                </div>
                <div className="questionBoxAnswers">
                    {props.options.map(opt => (<Answer key={opt.value} title={opt.title} onClick={() => {
                        setUnselected(false);
                        if (props.onChange !== undefined) {
                            props.onChange(opt.value);
                        }
                    }} />))}
                </div>
            </div>
        );
    } else {
        // we always expect find to return a value, the object declaration is just to fix typescript
        const selectedOption = props.options.find(opt => opt.value === props.value) || {
            activeText: undefined,
            title: ""
        };
        return (
            <>
                <div className="questionBoxSubmittedContainer question-box-submitted-container">
                    <div
                        style={{
                            width: "17px",
                            marginRight: "10px"
                        }}>
                        <img
                            style={{
                                width: "17px",
                            }}
                            src="/img/form-submitted-tick.png" />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            marginTop: "-2px"
                        }}>
                        <div
                            style={{
                                fontSize: "16px",
                            }}>
                            {selectedOption.activeText !== undefined ? selectedOption.activeText : `You choose ${selectedOption.title}.`}{" "}
                            <a href="" onClick={resubmitInfoClicked}>Resubmit answer?</a>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

type AnswerProps = {
    title: string,
    onClick?: () => void
};

export function Answer(props: PropsWithChildren<AnswerProps>) {
    const [isMouseHover, setMouseHover] = useState(false);

    return (
        <span
            className="questionBoxAnswer"
            onClick={props.onClick}
            onMouseEnter={() => setMouseHover(true)}
            onMouseLeave={() => setMouseHover(false)}
        >
            {props.title}
        </span>
    );
}