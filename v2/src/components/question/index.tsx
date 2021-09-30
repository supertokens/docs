import React, { Children, PropsWithChildren, useState } from "react";

export function Question(props: PropsWithChildren<{
    question: string
}>) {

    const [selectedAnsTitle, setSelectedAnsTitle] = useState(undefined);

    if (selectedAnsTitle === undefined) {
        return (
            <div
                style={{
                    width: "100%",
                    background: "#292929",
                    paddingTop: "20px",
                    paddingBottom: "20px",
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
                    {props.question}
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
            </div>
        );
    } else {
        let childrenComponent = null;
        React.Children.forEach(props.children, (child: any) => {
            if (child.props.title === selectedAnsTitle) {
                childrenComponent = child.props.children;
            }
        });
        return childrenComponent
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