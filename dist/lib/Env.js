"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = void 0;
const EnvHelpers_1 = require("./EnvHelpers");
exports.Env = {
    host: EnvHelpers_1.env("OBA_SERVICE_HOST", "localhost"),
    port: parseInt(EnvHelpers_1.env("OBA_SERVICE_PORT", "4000")),
    providers: {
        SEB: {
            endpoint: EnvHelpers_1.env("OBA_SEB_ENDPOINT", "https://test.api.ob.baltics.sebgroup.com"),
            certFile: EnvHelpers_1.envFile("OBA_SEB_CERT_FILE"),
            keyFile: EnvHelpers_1.envFile("OBA_SEB_KEY_FILE"),
        }
    }
};
