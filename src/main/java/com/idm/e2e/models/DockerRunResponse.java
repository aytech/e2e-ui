package com.idm.e2e.models;

import java.util.ArrayList;

public class DockerRunResponse {
    private boolean isValid;
    private ArrayList<String> errors;
    private String nodeID;

    public DockerRunResponse() {
        errors = new ArrayList<>();
    }

    public boolean isValid() {
        return isValid;
    }

    public void setValid(boolean valid) {
        isValid = valid;
    }

    public ArrayList<String> getErrors() {
        return errors;
    }

    public void addError(String error) {
        this.errors.add(error);
    }

    public String getNodeID() {
        return nodeID;
    }

    public void setNodeID(String nodeID) {
        this.nodeID = nodeID;
    }
}
