import * as React from 'react';

import { getCompatibility, GetCompatibilityResponse } from '../api/compatibility';
import getSupportedDrivers, { GetSupportedDriversResponse_Driver } from '../api/drivers';
import getSupportedFrontends, { GetSupportedFrontendsResponse_Frontend } from '../api/frontends';
import getSupportedPlugins, { GetSupportedPluginsResponse_Plugin } from '../api/plugins';
import "./style.css";

type Props = {

};

type State = {
    isFetchingPageData: boolean,
    isFetchingCompatibility: boolean,
    isPageError: boolean,
    plugins: GetSupportedPluginsResponse_Plugin[],
    drivers: GetSupportedDriversResponse_Driver[],
    frontends: GetSupportedFrontendsResponse_Frontend[],
    selectedPlugin: string,
    selectedDriver: string,
    selectedFrontend: string,
    compatibilityData: GetCompatibilityResponse,
    shouldShowCompatibility: boolean,
};

type Plan = "FREE" | "COMMERCIAL";

export default class CompatibilityMatrix extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isFetchingPageData: true,
            isFetchingCompatibility: true,
            isPageError: false,
            plugins: [],
            drivers: [],
            frontends: [],
            selectedPlugin: "",
            selectedDriver: "",
            selectedFrontend: "",
            compatibilityData: {
                cores: [],
                coreToDriver: {},
                coreToPlugin: {},
                driverToFrontend: {},
            },
            shouldShowCompatibility: false,
        };
    }

    getCurrentPlanType = (): Plan => {
        let isPro = window.location.href.includes("/pro/");

        if (isPro) {
            return "COMMERCIAL";
        }

        return "FREE";
    }

    sortDoubleDecimalNumbers = (compatibilityObject: any) => {
        let sortedObject = {}
        for (let dataKey in compatibilityObject) {
            const data = compatibilityObject[dataKey]
            if (typeof data === 'object') {

            }
        }

    }

    getFrameworkDropdown = () => {
        return (
            <div
                className="compatibility-select-container">
                <div
                    className="compatibility-select-title">
                    Select a backend SDK
                </div>

                <div
                    style={{
                        marginTop: "20px",
                        fontSize: "14px",
                    }}>
                    The library that helps your API communicate with the SuperTokens service (For example: supertokens-node).
                </div>

                <select
                    onChange={this.onDriverSelected}
                    value={this.state.selectedDriver}>
                    <option key="placeholder" value="" disabled hidden>Please select</option>
                    {
                        this.state.drivers.map(driver => {
                            return (
                                <option key={driver.id} value={driver.id}>{driver.displayName}</option>
                            );
                        })
                    }
                </select>
            </div>
        );
    }

    getDatabaseDropdown = () => {
        return (
            <div
                style={{
                    marginTop: "20px",
                }}
                className="compatibility-select-container">
                <div
                    className="compatibility-select-title">
                    Select a plugin
                </div>

                <div
                    style={{
                        marginTop: "20px",
                        fontSize: "14px",
                    }}>
                    The module that SuperTokens core uses to store data in the database (For example: mysql).
                </div>

                <select
                    onChange={this.onPluginSelected}
                    value={this.state.selectedPlugin}>
                    <option key="placeholder" value="" disabled hidden>Please select</option>
                    {
                        this.state.plugins.map(plugin => {
                            return (
                                <option key={plugin.id} value={plugin.id}>{plugin.displayName}</option>
                            );
                        })
                    }
                </select>
            </div>
        );
    }

    getFrontendDropdown = () => {
        return (
            <div
                style={{
                    marginTop: "20px",
                }}
                className="compatibility-select-container">
                <div
                    className="compatibility-select-title">
                    Select a frontend SDK
                </div>

                <div
                    style={{
                        marginTop: "20px",
                        fontSize: "14px",
                    }}>
                    The library you use in your app/website (For example: supertokens-ios).
                </div>

                <select
                    onChange={this.onFrontendSelected}
                    value={this.state.selectedFrontend}>
                    <option key="placeholder" value="" disabled hidden>Please select</option>
                    {
                        this.state.frontends.map(frontend => {
                            return (
                                <option key={frontend.id} value={frontend.id}>{frontend.displayName}</option>
                            );
                        })
                    }
                </select>
            </div>
        );
    }

    getDivider = () => {
        return (
            <div
                style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#dddddd",
                    marginTop: "40px",
                    marginBottom: "40px",
                }}>

            </div>
        );
    }

    getTableHeader = (firstTitle: string, secondTitle: string, firstHoverText: string, secondHoverText: string) => {
        return (
            <div
                className="compatibility-table-header-row">
                <div
                    style={{
                        borderTopLeftRadius: "6px",
                    }}
                    className="compatibility-table-header">
                    <div
                        className="compatibility-table-header-text">
                        {firstTitle}
                    </div>
                </div>

                <div
                    style={{
                        borderTopRightRadius: "6px",
                        borderLeftWidth: "1px",
                        borderLeftColor: "#1a1a1a",
                        borderLeftStyle: "solid",
                    }}
                    className="compatibility-table-header">
                    <div
                        className="compatibility-table-header-text">
                        {secondTitle}
                    </div>
                </div>
            </div>
        );
    }

    getCoreToDriver = () => {
        if (Object.keys(this.state.compatibilityData.coreToDriver).length === 0) {
            return null;
        }
        const currentSelectedCore = this.state.selectedDriver
        let displayName = ''
        for (let i = 0; i < this.state.drivers.length; i++) {
            const currentElement = this.state.drivers[i]
            if (currentElement.id === currentSelectedCore) {
                displayName = currentElement.displayName
            }
        }

        return (
            <div
                className="compatibility-table-section-container">
                <div
                    className="compatibility-table">
                    {this.getTableHeader("SuperTokens core version", `${displayName} SDK version`, "", "")}
                    {
                        Object.keys(this.state.compatibilityData.coreToDriver).map((key, index) => {
                            let current = this.state.compatibilityData.coreToDriver[key];
                            let isLast = index === Object.keys(this.state.compatibilityData.coreToDriver).length - 1;

                            return (
                                <div
                                    className="compatibility-table-row">
                                    <div
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#363636" : "#292929",
                                            borderBottomLeftRadius: isLast ? "6px" : "0px",
                                        }}
                                        className="compatibility-table-col">
                                        {key}.X
                                    </div>
                                    <div
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#363636" : "#292929",
                                            borderBottomRightRadius: isLast ? "6px" : "0px",
                                            borderLeftWidth: "1px",
                                            borderLeftColor: "#1a1a1a",
                                            borderLeftStyle: "solid",
                                        }}
                                        className="compatibility-table-col">
                                        {
                                            current.map((ver, index) => {
                                                return (
                                                    <span
                                                        style={{
                                                            marginTop: index === 0 ? "0px" : "10px"
                                                        }}>
                                                        {ver}
                                                    </span>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

    getCoreToPlugin = () => {
        if (Object.keys(this.state.compatibilityData.coreToPlugin).length === 0) {
            return null;
        }
        const currentSelectedPlugin = this.state.selectedPlugin
        let displayName = ''
        for (let i = 0; i < this.state.plugins.length; i++) {
            const currentElement = this.state.plugins[i]
            if (currentElement.id === currentSelectedPlugin) {
                displayName = currentElement.displayName
            }
        }

        return (
            <div
                className="compatibility-table-section-container">
                <div
                    className="compatibility-table">
                    {this.getTableHeader("SuperTokens core version", `${displayName} plugin version`, "", "")}
                    {
                        Object.keys(this.state.compatibilityData.coreToPlugin).map((key, index) => {
                            let current = this.state.compatibilityData.coreToPlugin[key];
                            let isLast = index === Object.keys(this.state.compatibilityData.coreToPlugin).length - 1;

                            return (
                                <div
                                    className="compatibility-table-row">
                                    <div
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#363636" : "#292929",
                                            borderBottomLeftRadius: isLast ? "6px" : "0px",
                                        }}
                                        className="compatibility-table-col">
                                        {key}.X
                                    </div>
                                    <div
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#363636" : "#292929",
                                            borderBottomRightRadius: isLast ? "6px" : "0px",
                                            borderLeftWidth: "1px",
                                            borderLeftColor: "#1a1a1a",
                                            borderLeftStyle: "solid",
                                        }}
                                        className="compatibility-table-col">
                                        {
                                            current.map((ver, index) => {
                                                return (
                                                    <span
                                                        style={{
                                                            marginTop: index === 0 ? "0px" : "10px"
                                                        }}>
                                                        {ver}
                                                    </span>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

    getDriverToFrontend = () => {
        if (Object.keys(this.state.compatibilityData.driverToFrontend).length === 0) {
            return null;
        }
        const currentSelectedFrontendSdk = this.state.selectedFrontend
        let displayName = ''
        for (let i = 0; i < this.state.frontends.length; i++) {
            const currentElement = this.state.frontends[i]
            if (currentElement.id === currentSelectedFrontendSdk) {
                displayName = currentElement.displayName
            }
        }

        let sdkDisplayName = ''
        for (const item of this.state.drivers) {
            if (item.id === this.state.selectedDriver) {
                sdkDisplayName = item.displayName
            }
        }

        return (
            <div
                className="compatibility-table-section-container">
                <div
                    className="compatibility-table">
                    {this.getTableHeader(`${sdkDisplayName} SDK version`, `${displayName} SDK version`, "", "")}
                    {
                        Object.keys(this.state.compatibilityData.driverToFrontend).map((key, index) => {
                            let current = this.state.compatibilityData.driverToFrontend[key];
                            let isLast = index === Object.keys(this.state.compatibilityData.driverToFrontend).length - 1;
                            return (
                                <div
                                    className="compatibility-table-row">
                                    <div
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#363636" : "#292929",
                                            borderBottomLeftRadius: isLast ? "6px" : "0px",
                                        }}
                                        className="compatibility-table-col">
                                        {key}.X
                                    </div>
                                    <div
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#363636" : "#292929",
                                            borderBottomRightRadius: isLast ? "6px" : "0px",
                                            borderLeftWidth: "1px",
                                            borderLeftColor: "#1a1a1a",
                                            borderLeftStyle: "solid",
                                        }}
                                        className="compatibility-table-col">
                                        {
                                            current.map((ver, index) => {
                                                return (
                                                    <span
                                                        style={{
                                                            marginTop: index === 0 ? "0px" : "10px"
                                                        }}>
                                                        {ver}
                                                    </span>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

    getCompatibilityContent = () => {
        if (this.state.isFetchingCompatibility) {
            return (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}>
                    <div className="st-spinner"></div>
                </div>
            );
        }

        return (
            <div
                style={{ width: "100%" }}>
                {this.getCoreToPlugin()}
                {this.getDivider()}
                {this.getCoreToDriver()}
                {this.getDivider()}
                {this.getDriverToFrontend()}
            </div>
        );
    }

    render() {
        if (this.state.isFetchingPageData) {
            return (
                <div
                    id="compatibility-root">
                    <div
                        style={{
                            width: "100%",
                            height: "60vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <div className="st-spinner" />
                    </div>
                </div>
            );
        }

        if (this.state.isPageError) {
            return (
                <div
                    id="compatibility-root">
                    <div
                        style={{
                            width: "100%",
                            height: "60vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <div
                                style={{
                                    fontSize: "22px",
                                    fontWeight: "bold",
                                }}>
                                Something went wrong
                            </div>

                            <div
                                onClick={this.onPageErrorRetryClicked}
                                style={{
                                    display: "flex",
                                    paddingLeft: "20px",
                                    paddingRight: "20px",
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    borderRadius: "6px",
                                    backgroundColor: "#f2f2f2",
                                    marginTop: "20px"
                                }}>
                                Try again
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                id="compatibility-root">
                {this.getFrameworkDropdown()}
                {this.getDatabaseDropdown()}
                {this.getFrontendDropdown()}

                <div
                    style={{
                        fontSize: "14px",
                        marginTop: "20px",
                    }}>
                    Run the <code style={{ fontWeight: 500 }}>supertokens --version</code> command to list your current SuperTokens <span style={{ fontWeight: 500 }}>plugin name</span>, <span style={{ fontWeight: 500 }}>plugin version</span> and <span style={{ fontWeight: 500 }}>core version</span>
                </div>


                {
                    this.state.shouldShowCompatibility &&
                    this.getDivider()
                }

                {
                    this.state.shouldShowCompatibility &&
                    this.getCompatibilityContent()
                }
            </div>
        );
    }

    componentDidMount() {
        this.fetchPageData();
    }

    fetchPageData = async () => {
        try {
            let planType: Plan = this.getCurrentPlanType();

            let pluginsResponse = await getSupportedPlugins(planType);
            let driversResponse = await getSupportedDrivers(planType);
            let frontendsResponse = await getSupportedFrontends();

            let plugins = pluginsResponse.plugins;
            let drivers = driversResponse.drivers;
            let frontends = frontendsResponse.frontends;

            this.setState(oldState => ({
                ...oldState,
                isFetchingPageData: false,
                isPageError: false,
                plugins: [...plugins],
                drivers: [...drivers],
                frontends: [...frontends],
            }));
        } catch (e) {
            this.setState(oldState => ({
                ...oldState,
                isFetchingPageData: false,
                isPageError: true,
            }));
        }
    }

    onPageErrorRetryClicked = () => {
        window.location.reload();
    }

    onPluginSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let value = event.target.value;
        this.setState(oldState => ({
            ...oldState,
            selectedPlugin: value,
        }), () => {
            this.fetchCompatibilityIfNeeded();
        });
    }

    onDriverSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let value = event.target.value;
        this.setState(oldState => ({
            ...oldState,
            selectedDriver: value,
        }), () => {
            this.fetchCompatibilityIfNeeded();
        });
    }

    onFrontendSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let value = event.target.value;
        this.setState(oldState => ({
            ...oldState,
            selectedFrontend: value,
        }), () => {
            this.fetchCompatibilityIfNeeded();
        });
    }

    // this should take an array only
    sortDoubleDecimalCompatibilityResponse = (compatibilityList: any) => {
        if (Array.isArray(compatibilityList)) {
            let compatibilitMap: any = {}
            const compatibilityFiltered = []
            const finalOutputArray = []
            for (let i = 0; i < compatibilityList.length; i++) {
                const compatibilityItem: string = compatibilityList[i]
                const filteredNumber = parseInt(compatibilityItem.split('.').join(''))
                compatibilitMap = {
                    ...compatibilitMap,
                    [filteredNumber]: compatibilityItem
                }
                compatibilityFiltered.push(filteredNumber)
            }
            const sortedCompatibilityItem = compatibilityFiltered.sort((a, b) => b - a)

            for (let i = 0; i < sortedCompatibilityItem.length; i++) {
                const currentComaptibilityElement = sortedCompatibilityItem[i]
                finalOutputArray.push(compatibilitMap[currentComaptibilityElement])
            }
            return finalOutputArray
        }
        return this.sortCompatibilityResponse(compatibilityList)
    }

    sortCompatibilityResponse = (compatibilityList: any) => {
        // Core Driver 
        for (let item in compatibilityList) {
            compatibilityList[item] = this.sortDoubleDecimalCompatibilityResponse(compatibilityList[item])
        }
        return compatibilityList
    }

    fetchCompatibilityIfNeeded = async () => {
        if (this.state.selectedDriver === "" || this.state.selectedFrontend === "" || this.state.selectedPlugin === "") {
            return;
        }

        this.setState(oldState => ({
            ...oldState,
            isFetchingCompatibility: true,
            shouldShowCompatibility: true,
        }));

        try {
            const compatibilityResponse = this.sortCompatibilityResponse(await getCompatibility(this.getCurrentPlanType(),
                this.state.selectedDriver, this.state.selectedPlugin, this.state.selectedFrontend));
            this.setState(oldState => ({
                ...oldState,
                isFetchingCompatibility: false,
                compatibilityData: { ...compatibilityResponse },
            }));
        } catch (e) {
            this.setState(oldState => ({
                ...oldState,
                isFetchingCompatibility: false,
                shouldShowCompatibility: false,
                isPageError: true,
            }));
        }
    }
}