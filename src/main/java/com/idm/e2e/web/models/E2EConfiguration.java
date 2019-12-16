package com.idm.e2e.web.models;

import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_WORK_DIRECTORY;

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
    private String nodeID;
    private String requestHost;

    public E2EConfiguration() {
        environment = "staging";
        url = "https://nlbavwidm1.infor.com/infor";
        filePrimary = String.format("%s/1.jpg", DOCKER_WORK_DIRECTORY);
        fileSecondary = String.format("%s/2.jpg", DOCKER_WORK_DIRECTORY);
        documentType = "Document";
        documentTypeNew = "File";
        downloadPath = "/home";
        email = "irdcmfiladm@infor.com";
        branch = "develop";
    }

    public String getEnvironment() {
        return environment;
    }

    public String getUrl() {
        return url;
    }

    public String getFilePrimary() {
        return filePrimary;
    }

    public String getFileSecondary() {
        return fileSecondary;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getDocumentTypeNew() {
        return documentTypeNew;
    }

    public String getDownloadPath() {
        return downloadPath;
    }

    public String getEmail() {
        return email;
    }

    public String getUser() {
        return user;
    }

    public String getPassword() {
        return password;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public void setEnvironment(String idmEnvironment) {
        this.environment = idmEnvironment;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNodeID() {
        return nodeID;
    }

    public void setNodeID(String nodeID) {
        this.nodeID = nodeID;
    }

    public void setRequestHost(String requestHost) {
        this.requestHost = requestHost;
    }

    public String getRequestHost() {
        return requestHost;
    }
}