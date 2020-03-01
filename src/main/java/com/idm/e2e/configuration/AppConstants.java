package com.idm.e2e.configuration;

public class AppConstants {
    public static final String APP_NAME = "Selenium Runner";
    public static final String CONFIGURATION = "configuration";
    public static final String CONFIGURATION_DIRECTORY = "e2e";
    public static final String CREDENTIALS = "credentials";
    public static final String EMAIL_FROM = "e2e.donotreply@infor.com";
    public static final String EMAIL_SUBJECT = "E2E Runner test report";
    public static final String GMAIL_ACCESS_TYPE = "offline";
    public static final String GMAIL_CREDENTIALS_PATH = "/keys/e2e-runner-credentials.json";
    public static final String GMAIL_DATA_STORE_PATH = "gmail_token";
    public static final String GMAIL_USER = "irdcmfiladm@gmail.com";
    public static final String MAINTAINER = "Oleg Yapparov <oleg.yapparov@infor.com>";
    public static final String REPORT_DIR = "tests";
    public static final String REPORT_ZIP = "report.zip";
    public static final String RSA_DIR = "keys";
    public static final String RSA_FILE = "id_rsa_teamcity-e2e";

    public static final String NODE_E2E_SUFFIX = "_suite";

    public static final String URI_ACTIVATE = "/activate";

    public static final String URI_CODE_RESET = "/code/reset";
    public static final String URI_API_BASE = "/api";
    public static final String URI_AUTH_BASE = "/auth";
    public static final String URI_MAIL_BASE = "/mail";
    public static final String URI_BUILD_STATUS = "/build/status";
    public static final String URI_CONTACT = "/contact";
    public static final String URI_DOWNLOAD_REPORT = "/build/report";
    public static final String URI_GMAIL_CHECK_CREDENTIALS = "/gmail/credentials";
    public static final String URI_GMAIL_RENEW_CREDENTIALS = "/gmail/credentials/renew";
    public static final String URI_GMAIL_SEND = "/gmail/send";
    public static final String URI_GMAIL_STORE_CREDENTIALS = "/gmail/credentials/store";
    public static final String URI_NODE = "/node";
    public static final String URI_NODE_REMOVE = "/node/remove";
    public static final String URI_PASSWORD_RESET = "/password/reset";
    public static final String URI_RESET = "/reset";
    public static final String URI_REGISTER = "/register";
    public static final String URI_RUN_E2E = "/build/run";
    public static final String URI_SETTINGS = "/settings";
    public static final String URI_STOP_PROCESS = "/build/stop";
    public static final String URI_VAR_CREATE = "/var/create";
    public static final String URI_VAR_REMOVE = "/var/remove";
    public static final String URI_VAR_UPDATE = "/var/update";

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_USER = "USER";
}