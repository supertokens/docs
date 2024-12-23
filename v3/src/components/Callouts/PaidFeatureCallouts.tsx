import React from "react";

import { Box } from "@radix-ui/themes";

export function MFAPaidFeatureCallout() {
	return (
		<Box mb="2">
			<div className="admonition admonition-caution alert alert--warning">
				<div className="admonition-heading">
					<h5>This is a paid feature</h5>
				</div>
				<div className="admonition-content">
					<p>
						For self hosted users,{" "}
						<a href="https://supertokens.com/auth" target="_blank">
							Sign up
						</a>{" "}
						to get a license key and follow the instructions sent to you by
						email. Using the dev license key is free. We only start charging you
						once you enable the feature in production using the provided
						production license key.
					</p>
					<p>
						For managed service users, you can click on the "enable paid
						features" button on{" "}
						<a href="https://supertokens.com/dashboard-saas" target="_blank">
							our dashboard
						</a>
						, and follow the steps from there on. Once enabled, this feature is
						free on the provided development environment.
					</p>
				</div>
			</div>
		</Box>
	);
}

export function MultiTenancyPaidFeatureCallout() {
	return (
		<Box mb="2">
			<div className="admonition admonition-caution alert alert--warning">
				<div className="admonition-heading">
					<h5>This is a paid feature</h5>
				</div>
				<div className="admonition-content">
					<p>
						For self hosted users,{" "}
						<a href="https://supertokens.com/auth" target="_blank">
							Sign up
						</a>{" "}
						to get a license key and follow the instructions sent to you by
						email. Creation of tenants is free on the dev license key.
					</p>
					<p>
						This feature is already enabled for managed service users. Creation
						of additional tenant is free on the provided development
						environment.
					</p>
				</div>
			</div>
		</Box>
	);
}

export function AccountLinkingFeatureCallout() {
	return (
		<Box mb="2">
			<div className="admonition admonition-caution alert alert--warning">
				<div className="admonition-heading">
					<h5>This is a paid feature</h5>
				</div>
				<div className="admonition-content">
					<p>
						For self hosted users,{" "}
						<a href="https://supertokens.com/auth" target="_blank">
							Sign up
						</a>{" "}
						to get a license key and follow the instructions sent to you by
						email. Using the dev license key is free. We only start charging you
						once you enable the feature in production using the provided
						production license key.
					</p>
					<p>
						For managed service users, you can click on the "enable paid
						features" button on{" "}
						<a href="https://supertokens.com/dashboard-saas" target="_blank">
							our dashboard
						</a>
						, and follow the steps from there on. Once enabled, this feature is
						free on the provided development environment.
					</p>
				</div>
			</div>
		</Box>
	);
}
