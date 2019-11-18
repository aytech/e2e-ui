package com.idm.e2e.web.models;

public class E2EConfiguration {
    public static final String ENV = "idm.environment";
    public static final String URL = "idm.client.staging.url";
    public static final String FILE_PRIMARY = "idm.file.path.primary";
    public static final String FILE_SECONDARY = "idm.file.path.secondary";
    public static final String DOCUMENT_TYPE = "idm.document.type";
    public static final String DOCUMENT_TYPE_NEW = "idm.document.type.new";
    public static final String DOWNLOAD_PATH = "idm.file.download.path";
    public static final String EMAIL = "idm.user.email";
    public static final String USER = "idm.user";
    public static final String PASSWORD = "idm.password";

    private String defaultEnvironment;
    private String defaultUrl;
    private String defaultFilePrimary;
    private String defaultFileSecondary;
    private String defaultDocumentType;
    private String defaultDocumentTypeNew;
    private String defaultDownloadPath;
    private String defaultEmail;
    private String defaultBranch;

    private String environment;
    private String url;
    private String filePrimary;
    private String fileSecondary;
    private String documentType;
    private String documentTypeNew;
    private String downloadPath;
    private String email;
    private String user;
    private String password;
    private String branch;

    public E2EConfiguration() {
        defaultEnvironment = "staging";
        defaultUrl = "https://nlbavwidm1.infor.com/infor";
        defaultFilePrimary = "/e2e/1.jpg";
        defaultFileSecondary = "/e2e/2.jpg";
        defaultDocumentType = "Document";
        defaultDocumentTypeNew = "File";
        defaultDownloadPath = "/home";
        defaultEmail = "irdcmfiladm@infor.com";
        defaultBranch = "develop";
    }

    public String getEnvironment() {
        if (environment == null) {
            return defaultEnvironment;
        }
        return environment;
    }

    public String getUrl() {
        if (url == null) {
            return defaultUrl;
        }
        return url;
    }

    public String getFilePrimary() {
        if (filePrimary == null) {
            return defaultFilePrimary;
        }
        return filePrimary;
    }

    public String getFileSecondary() {
        if (fileSecondary == null) {
            return defaultFileSecondary;
        }
        return fileSecondary;
    }

    public String getDocumentType() {
        if (documentType == null) {
            return defaultDocumentType;
        }
        return documentType;
    }

    public String getDocumentTypeNew() {
        if (documentTypeNew == null) {
            return defaultDocumentTypeNew;
        }
        return documentTypeNew;
    }

    public String getDownloadPath() {
        if (downloadPath == null) {
            return defaultDownloadPath;
        }
        return downloadPath;
    }

    public String getEmail() {
        if (email == null) {
            return defaultEmail;
        }
        return email;
    }

    public String getUser() {
        return user;
    }

    public String getPassword() {
        return password;
    }

    public String getBranch() {
        if (branch == null) {
            return defaultBranch;
        }
        return branch;
    }

    public void setEnvironment(String idmEnvironment) {
        this.environment = idmEnvironment;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setFilePrimary(String filePrimary) {
        this.filePrimary = filePrimary;
    }

    public void setFileSecondary(String fileSecondary) {
        this.fileSecondary = fileSecondary;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public void setDocumentTypeNew(String documentTypeNew) {
        this.documentTypeNew = documentTypeNew;
    }

    public void setDownloadPath(String downloadPath) {
        this.downloadPath = downloadPath;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}