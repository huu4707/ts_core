interface ServerConfig {
    HOST_DB: string;
    USER_DB: string,
    PASSWORD_DB: string,
    NAME_DB: string,
    JWT_TOKEN_SECRET_KEY: string,
    FB_APP_ID: string,
    FB_APP_SECRET: string,
    FB_CALLBACK_URL: string,
    GG_CLIENT_ID: string,
    GG_CLIENT_SECRET: string,
    GG_CALLBACK_URL: string,
    LOG_DIR: string,
    SENDER_EMAIL: string,
    SENDER_PASSWORD: string,
    HOST_SERVER: string,
    APP: string,
}

const developmentConfig: ServerConfig = {
    HOST_DB: 'localhost',
    USER_DB: 'root',
    PASSWORD_DB: '',
    NAME_DB: 'daikin',
    JWT_TOKEN_SECRET_KEY: 'sau bao nhieu nam ta lai gap lai nhau',
    FB_APP_ID: '446047046333253',
    FB_APP_SECRET: '416d66e8afdb75521a2648a6e620cf8d',
    FB_CALLBACK_URL: 'http://localhost:3000/public/account/auth/facebook/callback',
    GG_CLIENT_ID: '217836984420-7jfn9i1iplg6delki8ffci00b7ajk8c3.apps.googleusercontent.com',
    GG_CLIENT_SECRET: 'UyytgWE8-2fpZozKbBtcuX-Z',
    GG_CALLBACK_URL: 'http://localhost:3000/public/account/auth/google/callback',
    LOG_DIR: '../log/',
    SENDER_EMAIL: 'dev.test.3forcom',
    SENDER_PASSWORD: '3forcom123',
    HOST_SERVER: 'http://localhost:3000',
    APP: 'DAIKIN'
};

const stagingConfig: ServerConfig = {
    HOST_DB: 'localhost',
    USER_DB: 'root',
    PASSWORD_DB: '',
    NAME_DB: 'daikin',
    JWT_TOKEN_SECRET_KEY: 'sau bao nhieu nam ta lai gap lai nhau',
    FB_APP_ID: '446047046333253',
    FB_APP_SECRET: '416d66e8afdb75521a2648a6e620cf8d',
    FB_CALLBACK_URL: 'http://localhost:3000/public/account/auth/facebook/callback',
    GG_CLIENT_ID: '217836984420-7jfn9i1iplg6delki8ffci00b7ajk8c3.apps.googleusercontent.com',
    GG_CLIENT_SECRET: 'UyytgWE8-2fpZozKbBtcuX-Z',
    GG_CALLBACK_URL: 'http://localhost:3000/public/account/auth/google/callback',
    LOG_DIR: '../log/',
    SENDER_EMAIL: 'dev.test.3forcom',
    SENDER_PASSWORD: '3forcom123',
    HOST_SERVER: 'http://localhost:3000',
    APP: 'DAIKIN'
}

function getConfig(): ServerConfig {
    if (process.env.NODE_ENV === 'production') return stagingConfig;
    return developmentConfig;
}

export const { HOST_DB, USER_DB, PASSWORD_DB, NAME_DB, JWT_TOKEN_SECRET_KEY, LOG_DIR,
     FB_APP_ID, FB_APP_SECRET, FB_CALLBACK_URL, GG_CLIENT_ID, GG_CLIENT_SECRET, GG_CALLBACK_URL,
     SENDER_EMAIL, SENDER_PASSWORD, HOST_SERVER, APP
    } = getConfig();