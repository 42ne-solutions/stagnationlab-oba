
import request = require("request-promise-native");
import CheckedData from "typed-vault";
import { Env } from "../Env";
import { Authorization, AuthorizationMethod, AuthorizationStatus } from "../Authorization";
import { AccessToken } from "../AccessToken";

const URL_AUTHORIZE_DECOUPLED = "/v2/oauth/authorize-decoupled";
const URL_CREATE_TOKEN = "/v2/oauth/token";

export class SEB {

	private constructor() { }

	static async startAuthorization(method: AuthorizationMethod, psuId: string, psuCorporateId: string, bic: string, clientId: string, scopes: string[]): Promise<Authorization> {
		try {
			const authResponse = await request.post(requestOptions({
				url: URL_AUTHORIZE_DECOUPLED,
				body: {
					"psu_id": psuId,
					"psu_corporate_id": psuCorporateId,
					"bic": bic,
					"client_id": clientId,
					"scopes": scopes.join(" ")
				}
			}));
			const authData = new CheckedData(authResponse, "startAuthorizationAuthResponse", true);
			const authId = authData.string("authorization_id");
			const statusResponse = await request.patch(requestOptions({
				url: URL_AUTHORIZE_DECOUPLED + "/" + encodeURIComponent(authId),
				body: {
					"chosen_sca_method": SEB.getConvertedMethodName(method)
				}
			}));
			const statusData = new CheckedData(statusResponse, "startAuthorizationStatusResponse", true);
			const authChallengeCode = statusData.sub("challenge_data").string("code");
			return {
				id: authId,
				status: "IN_PROGRESS",
				challenge: {
					code: authChallengeCode
				}
			};
		} catch (err) {
			console.error(err);
			throw new Error("Unable to start authorization process");
		}
	}

	static async getAuthorizationById(id: string): Promise<Authorization> {
		try {
			const ID_MAX_LENGTH = 256;
			const safeId = id.substr(0, ID_MAX_LENGTH);
			const authResponse = await request.get(requestOptions({
				url: URL_AUTHORIZE_DECOUPLED + "/" + encodeURIComponent(safeId)
			}));
			const authData = new CheckedData(authResponse, "getAuthorizationByIdResponse", true);
			const authStatus = authData.string('status');
			return {
				id: safeId,
				status: SEB.getStatusFromLabel(authStatus)
			};
		} catch (err) {
			console.warn(err);
			throw new Error("Authorization not found: " + JSON.stringify(id));
		}
	}

	static async createAccessToken(authorizationId: string): Promise<AccessToken> {
		try {
			const tokenResponse = await request.post(requestOptions({
				url: URL_CREATE_TOKEN,
				body: {
					grant_type: "decoupled_authorization",
					authorization_id: authorizationId
				}
			}));
			const tokenData = new CheckedData(tokenResponse, "createAccessTokenResponse", true);
			return {
				type: tokenData.string("token_type"),
				token: tokenData.string("access_token"),
				expiresIn: tokenData.integer("expires_in")
			};
		} catch (err) {
			console.error(err);
			throw new Error("Unable to create access token for authorization: " + JSON.stringify(authorizationId));
		}
	}

	private static getConvertedMethodName(method: AuthorizationMethod) {
		switch (method) {
			case "MOBILE_ID": return "MobileID";
			case "SMART_ID": return "SmartID";
			default: throw new TypeError("Unexpected method name: " + method);
		}
	}

	private static getStatusFromLabel(statusLabel: string): AuthorizationStatus {
		switch (statusLabel) {
			case "finalized": return "SUCCESS";
			case "failed": return "FAILURE";
			default: return "IN_PROGRESS";
		}
	}

}


// Below is a little helper to fill request options

let requestId = (new Date).getUTCDate() * 1000;
function requestOptions(opts: { url: string, body?: { [ k: string ]: string } }) {
	return {
		baseUrl: Env.providers.SEB.endpoint,
		url: opts.url,
		headers: {
			"X-Request-ID": String(requestId++),
			"Date": (new Date).toUTCString()
		},
		body: opts.body,
		agentOptions: {
			cert: Env.providers.SEB.certFile,
			key: Env.providers.SEB.keyFile,
			rejectUnauthorized: false
		},
		json: true
	};
}
