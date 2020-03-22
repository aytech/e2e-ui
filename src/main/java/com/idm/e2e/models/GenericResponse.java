package com.idm.e2e.models;

public class GenericResponse {
    private Boolean success;
    private String message;
    protected JobNode node;

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

    public JobNode getNode() {
        return node;
    }

    public void setNode(JobNode node) {
        this.node = node;
    }
}
