package com.idm.e2e.models;

public class GenericResponse {
    private Boolean success;
    private String message;

    public GenericResponse() {
    }

    public GenericResponse(Boolean success) {
        this.success = success;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
