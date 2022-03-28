
import React, { useState, useRef, useEffect } from "react";
import {isMobile, isTablet} from 'react-device-detect';

import "./style.css";

type FormItemType = {
    title: string,
    placeholder: string,
    onChange: (val: string) => void,
    explanation: string,
    value: string,
    index: number,
    error?: string,
    required?: boolean
}

export default function FormItem(props: FormItemType) {
    // State
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationLocation, setExplanationLocation] = useState({
        x: 0,
        y: 0
    });

    // Refs
    const questionIconRef: any = useRef(undefined);

    // Did mount
    useEffect(() => {
        if (questionIconRef.current !== undefined) {
            const { current } = questionIconRef;

            // Add event listeners
            window.addEventListener('scroll', handleMouseOutIcon);

            if (isMobile || isTablet) {
                current.addEventListener('click', handleMouseClickIcon);
                window.addEventListener('click', handleMouseClickOutIcon);
            } else {
                current.addEventListener('mouseover', handleMouseOverIcon);
                current.addEventListener('mouseout', handleMouseOutIcon);
            }
        }

        return () => {
            if (questionIconRef.current !== undefined && questionIconRef.current !== null) {
                window.removeEventListener('scroll', handleMouseOutIcon);

                if (isMobile || isTablet) {
                    questionIconRef.current.removeEventListener('click', handleMouseClickIcon);
                    window.removeEventListener('click', handleMouseClickOutIcon);
                } else {
                    questionIconRef.current.removeEventListener('mouseover', handleMouseOverIcon);
                    questionIconRef.current.removeEventListener('mouseout', handleMouseOutIcon);
                }
            }
        }
    }, [])

    const handleMouseOverIcon = () => {
        // Calculate explanation position
        const rect = questionIconRef.current.getBoundingClientRect();
        const xPosition = rect.left + (rect.width / 2);
        const yPosition = rect.top + rect.height + 18;

        setExplanationLocation({
            x: xPosition,
            y: yPosition
        });

        setShowExplanation(true);
    }

    const handleMouseOutIcon = () => {
        setShowExplanation(false);
    }

    const handleMouseClickIcon = () => {
        handleMouseOverIcon();
    }

    const handleMouseClickOutIcon = (event: MouseEvent) => {
        const element = event.target as HTMLElement;

        if (element.id !== `app-info-form-question-icon-${props.index}`) {
            handleMouseOutIcon();
        }

        event.stopPropagation();
    }

    return (
        <div className="app-info-form-question">
                <div className="app-info-form-label">
                    <span>
                        {props.title + ":"}
                        {props.required && (<span style={{ color: "#ff6161" }}>*</span>)}
                    </span>
                    <div className="question">
                        <img
                            id={`app-info-form-question-icon-${props.index}`}
                            className="app-info-form-question-icon"
                            src="/img/form-question.png"
                            ref={questionIconRef}
                        />
                    </div>
                </div>
            <div className="app-info-form-field-container">
                <input
                    value={props.value}
                    onChange={(evt) => {
                        props.onChange(evt.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "34px",
                        borderRadius: "6px",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontSize: "14px",
                        color: "#222222",
                        border: "1px solid rgb(72, 72, 72)"
                    }}
                    placeholder={props.placeholder}
                />

                {props.error && (
                    <p
                        style={{
                            color: "rgb(255, 97, 97)",
                            margin: "0",
                            fontSize: ".875rem",
                            fontWeight: "500"
                        }}
                    >
                        *{props.error}
                    </p>
                )}

                <div
                    className={`app-info-form-explanation ${showExplanation ? "show" : ""}`}
                    style={{
                        top: `${explanationLocation.y}px`,
                        left: `${explanationLocation.x}px`
                    }}
                >
                    {props.explanation}
                </div>
            </div>
        </div>
    );
}