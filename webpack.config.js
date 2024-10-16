const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

module.exports = {
    plugins: [
        new Dotenv(),
        new webpack.DefinePlugin({
            // Sets .env variables in development mode.
            // See the nginx config for env var injection on runtime for the production build
            'window.ENVIRONMENT': JSON.stringify({
                FC_QUERY_URL: env.FC_QUERY_URL || '',
                FC_KEYCLOAK_AUTH_URL: env.FC_KEYCLOAK_AUTH_URL || '',
                FC_KEYCLOAK_CLIENT_SCOPE: env.FC_KEYCLOAK_CLIENT_SCOPE || '',
                FC_KEYCLOAK_CLIENT_ID: env.FC_KEYCLOAK_CLIENT_ID || '',
                FC_KEYCLOAK_CLIENT_SECRET: env.FC_KEYCLOAK_CLIENT_SECRET || '',
                DEMO_USERNAME: env.DEMO_USERNAME || '',
                DEMO_PASSWORD: env.DEMO_PASSWORD || '',
            }),
        }),
    ],
};
