
import { env, envFile } from "./EnvHelpers";

export const Env = {

	host: env("OBA_SERVICE_HOST", "localhost"),
	port: parseInt(env("OBA_SERVICE_PORT", "4000")),

	providers: {

		SEB: {
			endpoint: env("OBA_SEB_ENDPOINT", "https://test.api.ob.baltics.sebgroup.com"),
			certFile: envFile("OBA_SEB_CERT_FILE", __dirname + "/../../assets/client.crt"),
			keyFile: envFile("OBA_SEB_KEY_FILE", __dirname + "/../../assets/client.key"),
		}

	}

}
