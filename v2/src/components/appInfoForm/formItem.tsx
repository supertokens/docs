
import React, { useState } from "react";
import "./style.css";

export default function FormItem(props: { title: string, placeholder: string, onChange: (val: string) => void, explanation: string, value: string }) {

    let [showExplanation, setShowExplanation] = useState(false)

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                marginBottom: "14px",
            }}>
            {props.title + ":"}
            <div style={{ width: "1%" }} />
            <div
                onClick={() => {
                    setShowExplanation(!showExplanation);
                }}
                className="question">
                <img
                    src="/img/form-question.png" />
            </div>
            <div
                style={{
                    flex: 1,
                    minWidth: "3%",
                }} />
            <div
                style={{
                    width: "70%",
                    display: "flex",
                    flexDirection: "column",
                }}>
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
                        color: "#222222"
                    }}
                    placeholder={props.placeholder} />
                {showExplanation &&
                    <div
                        style={{
                            marginTop: "8px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "20px",
                            paddingRight: "20px",
                            borderRadius: "6px",
                            background: "#363636",
                            fontSize: "14px",
                        }}>
                        {props.explanation}
                    </div>}
            </div>
        </div>
    );
}