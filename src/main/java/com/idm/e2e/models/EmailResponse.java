package com.idm.e2e.models;

@SuppressWarnings("unused")
public class EmailResponse {
    private String authURL;
    private Boolean isConfigured;
    private String error;
    private String message;

    public String getAuthURL() {
        return authURL;
    }

    public void setAuthURL(String authURL) {
        this.authURL = authURL;
    }

    public Boolean getConfigured() {
        return isConfigured;
    }

    public void setConfigured(Boolean configured) {
        isConfigured = configured;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
