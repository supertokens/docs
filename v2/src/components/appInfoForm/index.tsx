import React, { PropsWithChildren, useState } from "react";
import "./style.css";

type Props = {
    askForAppName: boolean,
    askForAPIDomain: boolean,
    askForWebsiteDomain: boolean
};

type State = {
    formSubmitted: boolean,
    appName: string,
    apiDomain: string,
    websiteDomain: string,
};

export default class AppInfoForm extends React.PureComponent<PropsWithChildren<Props>, State> {

    constructor(props: PropsWithChildren<Props>) {
        super(props);
        this.state = {
            formSubmitted: false,
            appName: "",
            apiDomain: "",
            websiteDomain: ""
        }
    }

    render() {
        if (this.state.formSubmitted) {
            // TODO:
            return this.props.children;
        } else {
            return (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "6px",
                        background: "#292929",
                        padding: "16px",
                        marginBottom: "10px",
                        color: "#ffffff",
                    }}>
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: 600
                        }}>
                        PLEASE PROVIDE YOUR CONFIGURATION VALUES
                    </div>
                    <div style={{ height: "25px" }} />
                    <div
                        style={{
                            paddingLeft: "2%",
                            paddingRight: "11%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        {this.props.askForAppName && <FormItem
                            title="appName"
                            placeholder="e.g. My awesome App"
                            onChange={(val) => {
                                this.setState(oldState => {
                                    return {
                                        ...oldState,
                                        appName: val
                                    };
                                })
                            }}
                            explanation="This is the name of your application"
                            value={this.state.appName} />}
                        {this.props.askForAPIDomain && <FormItem
                            title="apiDomain"
                            placeholder="e.g. http://localhost:8080"
                            onChange={(val) => {
                                this.setState(oldState => {
                                    return {
                                        ...oldState,
                                        apiDomain: val
                                    };
                                })
                            }}
                            explanation="This the the URL of your API domain, without any path."
                            value={this.state.apiDomain} />}
                        {this.props.askForWebsiteDomain && <FormItem
                            title="websiteDomain"
                            placeholder="e.g. http://localhost:3000"
                            onChange={(val) => {
                                this.setState(oldState => {
                                    return {
                                        ...oldState,
                                        websiteDomain: val
                                    };
                                })
                            }}
                            explanation="This the the URL of your website, without any path."
                            value={this.state.appName} />}
                    </div>
                </div>
            );
        }
    }
}

function FormItem(props: { title: string, placeholder: string, onChange: (val: string) => void, explanation: string, value: string }) {

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