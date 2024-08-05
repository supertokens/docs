import React, { PropsWithChildren } from "react";
import { recursiveMap } from "../utils";
import getURI from "../api/authReact";
import { MOCK_ENABLED } from "../constants";


type State = {
    uri: string | undefined
};

export default class PrebuiltUIInjector extends React.PureComponent<PropsWithChildren<{}>, State> {

    isUnmounting = false;

    constructor(props: PropsWithChildren<{}>) {
        super(props);
        this.state = {
            uri: undefined
        };
    }

    render() {
        let result;
        if (this.state.uri !== undefined) {
            let uri = this.state.uri;
            result = recursiveMap(this.props.children, (c: any) => {
                if (typeof c === "string") {
                    c = c.split("^{jsdeliver_prebuiltui}").join(uri)
                }
                return c;
            });
        } else {
            result = recursiveMap(this.props.children, (c: any) => {
                if (typeof c === "string") {
                    c = c.split("^{jsdeliver_prebuiltui}").join("")
                }
                return c;
            });
        }

        return result;
    }

    async componentDidMount() {
        if (typeof window != 'undefined') {
            if (MOCK_ENABLED) {
                if (this.isUnmounting) {
                    return;
                }
                this.setState(oldState => {
                    return {
                        ...oldState,
                        uri: "https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@vX.Y.Z/build/static/js/main.test.js"
                    };
                })
            } else {
                try {
                    let uri = await getURI();
                    if (this.isUnmounting) {
                        return;
                    }
                    this.setState(oldState => {
                        return {
                            ...oldState,
                            uri: uri.uri
                        };
                    })
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    componentWillUnmount() {
        this.isUnmounting = true;
    }
}