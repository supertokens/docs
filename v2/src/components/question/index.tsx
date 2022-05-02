import React, { Children, PropsWithChildren, useState } from "react";

import "./question.css";

export function Question(props: PropsWithChildren<{
    question: string | (() => JSX.Element)
}>) {
    const [selectedAnsTitle, setSelectedAnsTitle] = useState(undefined);

    let resubmitInfoClicked = (event: any) => {
        event.preventDefault();
        setSelectedAnsTitle(undefined);
    };

    if (selectedAnsTitle === undefined) {
        return (
            <div className="question-box">
                <div className="question-box-text">
                    {typeof props.question === "string" ? props.question : props.question()}
                </div>
                <div className="question-box-answers">
                    {Children.map(props.children, (child: any, index: number) => {
                        return React.cloneElement(child, {
                            ...child.props,
                            onClick: () => setSelectedAnsTitle(child.props.title)
                        });
                    })}
                </div>
            </div>
        );
    } else {
        let childrenComponent = null;
        Children.forEach(props.children, (child: any) => {
            if (child.props.title === selectedAnsTitle) {
                childrenComponent = child.props.children;
            }
        });
        return (
            <>
                <div className="question-box-submitted-container">
                    <div
                        style={{
                            width: "17px",
                            marginRight: "10px"
                        }}>
                        <img
                            alt="Answer submitted"
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
                            The content below is shown based on your answer. <a href="" onClick={resubmitInfoClicked}>Resubmit answer?</a>
                        </div>
                    </div>
                </div>
                {childrenComponent}
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
            className="question-box-answer"
            onClick={props.onClick}
            onMouseEnter={() => setMouseHover(true)}
            onMouseLeave={() => setMouseHover(false)}
        >
            {props.title}
        </span>
    );
}