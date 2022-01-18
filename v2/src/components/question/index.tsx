import React, { Children, PropsWithChildren, useState } from "react";

export function Question(props: PropsWithChildren<{
    question: string | (() => JSX.Element)
}>) {

    const [selectedAnsTitle, setSelectedAnsTitle] = useState(undefined);

    let resubmitInfoClicked = (event: any) => {
        event.preventDefault();
        setSelectedAnsTitle(undefined);
    }

    if (selectedAnsTitle === undefined) {
        return (
            <div
                style={{
                    width: "100%",
                    background: "#292929",
                    paddingTop: "20px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                }}>
                <div style={{
                    fontSize: "24px",
                    color: "#ffffff",
                    fontWeight: 600,
                }}>
                    {typeof props.question === "string" ? props.question : props.question()}
                </div>
                <div
                    style={{
                        marginTop: "10px",
                        flexWrap: "wrap",
                        display: "flex"
                    }}>
                    {React.Children.map(props.children, (child: any) => {
                        return React.cloneElement(child, {
                            ...child.props,
                            onClick: () => {
                                setSelectedAnsTitle(child.props.title)
                            }
                        });
                    })}
                </div>
                <div
                    style={{
                        height: "25px",
                        marginRight: "-5px",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#ffffff",
                        fontSize: "12px",
                        display: "flex",
                        fontStyle: "italic"
                    }}>
                    <span
                        style={{ flex: 1 }} />
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
                    style={{
                        width: "100%",
                        display: "flex",
                        borderRadius: "6px",
                        background: "#292929",
                        padding: "16px",
                        marginBottom: "20px",
                        color: "#ffffff",
                    }}>
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
    onClick?: () => void
}

export function Answer(props: PropsWithChildren<AnswerProps>) {

    const [isMouseHover, setMouseHover] = useState(false)

    return (
        <span
            onClick={props.onClick}
            onMouseEnter={() => {
                setMouseHover(true)
            }}
            onMouseLeave={() => {
                setMouseHover(false)
            }}
            style={{
                marginTop: "10px",
                marginRight: "30px",
                cursor: "pointer",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "5px",
                paddingBottom: "5px",
                background: "#363636",
                borderRadius: "6px",
                borderColor: isMouseHover ? "#ff9933" : "#4d4d4d",
                borderStyle: "solid",
                borderWidth: "1px",
                fontWeight: 600,
            }}>
            {props.title}
        </span>
    );
}