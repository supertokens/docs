import React, { PropsWithChildren } from "react";
import supertokens from "supertokens-website";
import { recursiveMap } from "../utils";

type Props = {

};

type State = {
    sessionState: "EXISTS" | "NOT_EXISTS" | "UNKNOWN"
};

export default class CoreInjector extends React.PureComponent<PropsWithChildren<Props>, State> {
    constructor(props: PropsWithChildren<Props>) {
        super(props);
        this.state = {
            sessionState: "UNKNOWN"
        };
    }

    render() {
        if (this.state.sessionState === "UNKNOWN") {
            return recursiveMap(this.props.children, (c) => {
                if (typeof c === "string") {
                    c = c.split("^{coreInjector_uri}").join('"",');
                    c = c.split("^{coreInjector_api_key}").join('""')
                    c = c.split("^{coreInjector_api_key_commented}").join('')
                }
                return c;
            });
        } else if (this.state.sessionState === "EXISTS") {
            // TODO:
            return null;
        }
        return recursiveMap(this.props.children, (c) => {
            if (typeof c === "string") {
                c = c.split("^{coreInjector_uri}").join('"https://try.supertokens.io", // This is hosted for demo purposes. You can use this, but make sure to change it to your core instance URI eventually.');
                c = c.split("^{coreInjector_api_key}").join('"IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE"')
                c = c.split("^{coreInjector_api_key_commented}").join('// ')
            }
            return c;
        });
    }

    async componentDidMount() {
        if (typeof window != 'undefined') {
            if (!await supertokens.doesSessionExist()) {
                this.setState(oldState => {
                    return {
                        ...oldState,
                        sessionState: "NOT_EXISTS"
                    };
                })
            } else {
                // TODO:
            }
        }
    }
}