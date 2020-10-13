
export interface Authorization {
	id: string;
	status: AuthorizationStatus;
	challenge?: AuthorizationChallenge;
}

export interface AuthorizationChallenge {
	code: string;
}

export type AuthorizationStatus = "IN_PROGRESS" | "SUCCESS" | "FAILURE";

export type AuthorizationMethod = "MOBILE_ID" | "SMART_ID";
