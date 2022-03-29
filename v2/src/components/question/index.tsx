import React, { Children, PropsWithChildren, useState, useRef, useEffect } from "react";

import "./question.css";

export function Question(props: PropsWithChildren<{
    question: string | (() => JSX.Element)
}>) {
    const answerBoxRef = useRef<HTMLDivElement>(null);

    const [extraPaddingToAnswerBox, setExtraPaddingToAnswerBox] = useState(false);
    const [selectedAnsTitle, setSelectedAnsTitle] = useState(undefined);

    let resubmitInfoClicked = (event: any) => {
        event.preventDefault();
        setSelectedAnsTitle(undefined);
    };

    useEffect(() => {
        updateAnswerBoxPaddingIfAnswersOverflow();
    }, [selectedAnsTitle]);

    const updateAnswerBoxPaddingIfAnswersOverflow = () => {
        if (answerBoxRef !== null && answerBoxRef.current !== null) {
            const answersInsideContainer = answerBoxRef.current.getElementsByClassName("question-box-answer");

            const messageWidth = 227;
            const answerBoxWidth = answerBoxRef.current.getBoundingClientRect().width;
            const availableWidth = answerBoxWidth - messageWidth - 36;

            let totalAnswersWidth = 0;
            for (const answer of answersInsideContainer) {
                const width = answer.getBoundingClientRect().width;
                totalAnswersWidth = totalAnswersWidth + width + 24;
            }
            setExtraPaddingToAnswerBox(totalAnswersWidth > availableWidth);
        }
    };

    const answersBoxClass = `question-box-answers ${extraPaddingToAnswerBox ? "extra-padding" : ""}`;

    if (selectedAnsTitle === undefined) {
        return (
            <div className="question-box">
                <div className="question-box-text">
                    {typeof props.question === "string" ? props.question : props.question()}
                </div>
                <div
                    className={answersBoxClass}
                    ref={answerBoxRef}
                >
                    {Children.map(props.children, (child: any, index: number) => {
                        return React.cloneElement(child, {
                            ...child.props,
                            onClick: () => setSelectedAnsTitle(child.props.title)
                        });
                    })}
                    <div className="question-box-suggestion">
                        Refresh the page to undo your selection
                    </div>
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