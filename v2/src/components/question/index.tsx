import React, { Children, PropsWithChildren, useState } from "react";

let styles = require('./question.module.css').default;

export function Question(props: PropsWithChildren<{
    question: string | (() => JSX.Element)
}>) {

    const [selectedAnsTitle, setSelectedAnsTitle] = useState(undefined);

    let resubmitInfoClicked = (event) => {
        event.preventDefault();
        setSelectedAnsTitle(undefined);
    }

    if (selectedAnsTitle === undefined) {
        return (
            <div className={`${styles.questionBox} question-box`}>
                <div className={styles.questionBoxText}>
                    {typeof props.question === "string" ? props.question : props.question()}
                </div>
                <div className={styles.questionBoxAnswers}>
                    {React.Children.map(props.children, (child: any, index: number) => {
                        const element = React.cloneElement(child, {
                            isLast: index === Children.count(props.children) - 1,
                            ...child.props,
                            onClick: () => {
                                setSelectedAnsTitle(child.props.title)
                            }
                        });
                        return element
                    })}
                </div>
                <div className={styles.questionBoxSuggestion}>
                    Refresh the page to undo your selection
                </div>
            </div>
        );
    } else {
        let childrenComponent = null;
        React.Children.forEach(props.children, (child: any) => {
            if (child.props.title === selectedAnsTitle) {
                childrenComponent = child.props.children;
            }
        });
        return (
            <>
                <div
                    className={`${styles.questionBoxSubmittedContainer} question-box-submitted-container`}
                >
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
        )
    }
}

type AnswerProps = {
    title: string,
    onClick?: () => void,
    isLast: boolean
}

export function Answer(props: PropsWithChildren<AnswerProps>) {

    const [isMouseHover, setMouseHover] = useState(false)

    return (
        <>
            <span
                className={styles.questionBoxAnswer}
                onClick={props.onClick}
                onMouseEnter={() => {
                    setMouseHover(true)
                }}
                onMouseLeave={() => {
                    setMouseHover(false)
                }}
            >
                {props.title}
            </span>
            {!props.isLast && (<span className={styles.questionBoxAnswerSlash}>/</span>)}
        </>
    );
}