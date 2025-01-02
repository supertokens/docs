type SaasConnectionUrlDomainCommonInfo = {
	deploymentId: string;
	deploymentName: string;
	region: string;
};

type SaasAppDeploymentConnectionInfo = {
	host: string;
	apiKeys: string[];
};

type SaasConnectionUriDomainApp = {
	appId: string;
	deployments: SaasAppDeployment[];
};

type SaasAppDeploymentCommonInfo = {
	coreVersion: string;
	config: SaasAppDeploymentConfig[];
	status: "active" | "restarting";
};

type SaasAppDeploymentConfig = {
	keyName: string;
	value: string;
	description: string | number | boolean;
};

type SaasAppDevDeployment = SaasAppDeploymentCommonInfo & {
	deploymentType: "development";
	connectionInfo: SaasAppDeploymentConnectionInfo;
};

type SaasAppProdDeployment = SaasAppDeploymentCommonInfo & {
	deploymentType: "production";
	connectionInfo?: SaasAppDeploymentConnectionInfo & {
		serviceApiKey: string;
	};
	pricing?: {
		basePrice: number;
		pricePerInstance: number;
		numberOfInstancesToPayFor: number;
		nextDueDate?: number;
	};
};

type SaasAppDeployment = SaasAppDevDeployment | SaasAppProdDeployment;

export type SaasConnectionUrlDomain = SaasConnectionUrlDomainCommonInfo &
	(
		| {
				isTemporarilyRemoved: false;
				apps: SaasConnectionUriDomainApp[];
		  }
		| {
				isTemporarilyRemoved: true;
				isRecreating: boolean;
		  }
	);

export type SaasAppListItem = {
	appName: string;
	appId: string;
	region: string;
	isTemporarilyRemoved: boolean;
	devDeployment: SassAppDevData;
	prodDeployment: SassAppProductionData;
};

export type SassAppDevData = {
	id: string;
	/** Version in format X.Y */
	supertokensVersion?: string;
	connectionInfo?: {
		host: string;
		apiKeys: string[];
	};
	config: {
		keyName: string;
		value: string | number | boolean;
		description: string;
	}[];
	supertokensInstance: {
		status: "active" | "restarting";
		/** unique ID across all instances */
		containerName: string;
	}[];
};

type SassAppProductionData = SassAppDevData & {
	userHadCreated: boolean;
	connectionInfo?: SassAppDevData["connectionInfo"] & {
		serviceApiKey: string;
	};
	pricing?: {
		basePrice: number;
		pricePerInstance: number;
		numberOfInstancesToPayFor: number;
		nextDueDate?: number;
	};
};
