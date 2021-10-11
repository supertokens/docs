import * as React from "react";

export default class BackendSDKCasing extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            sdk: typeof window === 'undefined' ? "nodejs" : window.localStorage.getItem("docusaurus.tab.backendsdk")
        };
    }

    componentDidMount() {
        if (typeof window !== 'undefined') {
            window.addEventListener("docs-tab-change", this.setSDK);
        }
    }

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener("docs-tab-change", this.setSDK);
        }
    }

    setSDK = () => {
        this.setState({ sdk: typeof window === 'undefined' ? "nodejs" : window.localStorage.getItem("docusaurus.tab.backendsdk") });
    };

    camelToSnakeCase = (str: string) => { if (str !== "connectionURI") {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    } else {
        return "connection_uri"
    }};

    camelToPascalCase = (str) => {
        if (str.length === 0) {
            return str;
        }
        return str[0].toUpperCase() + str.slice(1);
    };

    render() {
        if (this.state.sdk === "python") {
            return (<code>{this.camelToSnakeCase(this.props.children)}</code>);
        } else if (this.state.sdk === "go") {
            return (<code>{this.camelToPascalCase(this.props.children)}</code>);
        } else {
            return (<code>{this.props.children}</code>);
        }
    }
}