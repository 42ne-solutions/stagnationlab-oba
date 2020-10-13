"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEB = void 0;
const request = require("request-promise-native");
const typed_vault_1 = require("typed-vault");
const Env_1 = require("../Env");
const URL_AUTHORIZE_DECOUPLED = "/v2/oauth/authorize-decoupled";
const URL_CREATE_TOKEN = "/v2/oauth/token";
class SEB {
    constructor() { }
    static async startAuthorization(method, psuId, psuCorporateId, bic, clientId, scopes) {
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
            const authData = new typed_vault_1.default(authResponse, "startAuthorizationAuthResponse", true);
            const authId = authData.string("authorization_id");
            const statusResponse = await request.patch(requestOptions({
                url: URL_AUTHORIZE_DECOUPLED + "/" + encodeURIComponent(authId),
                body: {
                    "chosen_sca_method": SEB.getConvertedMethodName(method)
                }
            }));
            const statusData = new typed_vault_1.default(statusResponse, "startAuthorizationStatusResponse", true);
            const authChallengeCode = statusData.sub("challenge_data").string("code");
            return {
                id: authId,
                status: "IN_PROGRESS",
                challenge: {
                    code: authChallengeCode
                }
            };
        }
        catch (err) {
            console.error(err);
            throw new Error("Unable to start authorization process");
        }
    }
    static async getAuthorizationById(id) {
        try {
            const ID_MAX_LENGTH = 256;
            const safeId = id.substr(0, ID_MAX_LENGTH);
            const authResponse = await request.get(requestOptions({
                url: URL_AUTHORIZE_DECOUPLED + "/" + encodeURIComponent(safeId)
            }));
            const authData = new typed_vault_1.default(authResponse, "getAuthorizationByIdResponse", true);
            const authStatus = authData.string('status');
            return {
                id: safeId,
                status: SEB.getStatusFromLabel(authStatus)
            };
        }
        catch (err) {
            console.warn(err);
            throw new Error("Authorization not found: " + JSON.stringify(id));
        }
    }
    static async createAccessToken(authorizationId) {
        try {
            const tokenResponse = await request.post(requestOptions({
                url: URL_CREATE_TOKEN,
                body: {
                    grant_type: "decoupled_authorization",
                    authorization_id: authorizationId
                }
            }));
            const tokenData = new typed_vault_1.default(tokenResponse, "createAccessTokenResponse", true);
            return {
                type: tokenData.string("token_type"),
                token: tokenData.string("access_token"),
                expiresIn: tokenData.integer("expires_in")
            };
        }
        catch (err) {
            console.error(err);
            throw new Error("Unable to create access token for authorization: " + JSON.stringify(authorizationId));
        }
    }
    static getConvertedMethodName(method) {
        switch (method) {
            case "MOBILE_ID": return "MobileID";
            case "SMART_ID": return "SmartID";
            default: throw new TypeError("Unexpected method name: " + method);
        }
    }
    static getStatusFromLabel(statusLabel) {
        switch (statusLabel) {
            case "finalized": return "SUCCESS";
            case "failed": return "FAILURE";
            default: return "IN_PROGRESS";
        }
    }
}
exports.SEB = SEB;
let requestId = (new Date).getUTCDate() * 1000;
function requestOptions(opts) {
    return {
        baseUrl: Env_1.Env.providers.SEB.endpoint,
        url: opts.url,
        headers: {
            "X-Request-ID": String(requestId++),
            "Date": (new Date).toUTCString()
        },
        body: opts.body,
        agentOptions: {
            cert: Env_1.Env.providers.SEB.certFile,
            key: Env_1.Env.providers.SEB.keyFile,
            rejectUnauthorized: false
        },
        json: true
    };
}
