# Open Banking Authenticator (OBA)

This is an example GraphQL service that's inteded to create authorization tokens for SEB platform.

#### Installation
Open Banking Authenticator requires Node.js version 12 or later to run.

First you'll need to setup your environment variables as follows:
```sh
# Optional, defaults to "localhost"
OBA_SERVICE_HOST="localhost"
# Optional, defaults to 4000
OBA_SERVICE_PORT="4000"
# Optional, defaults to "https://test.api.ob.baltics.sebgroup.com"
OBA_SEB_ENDPOINT="https://test.api.ob.baltics.sebgroup.com"
# Mandatory, path to your CERT file provided by SEB
OBA_SEB_CERT_FILE="/path/to/client.cert"
# Mandatory, path to your KEY file provided by SEB
OBA_SEB_KEY_FILE="/path/to/client.key"
```

#### Usage

Afterwards you can run the server from project's directory as simple as:
```
node .
```
Alternatively, you can issue a command like:
```
npm start
```

In order to get GraphQL Playground to service just visit the configured host and port.
By default, you can get there by entering the following line in your browser's address bar:
```
http://localhost:4000/
```

Direct access to API happens by the same URI (just use POST method for sending requests).

#### Notes

There still are a lot of things missing from the code (like logging, extended validation and error reporting, etc), but it's still good enough for an example.


