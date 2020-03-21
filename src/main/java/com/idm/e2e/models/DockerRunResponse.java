package com.idm.e2e.models;

import java.util.ArrayList;
import java.util.List;

public class DockerRunResponse {
    private boolean isValid;
    private ArrayList<String> errors;
    private String nodeID;
    private List<JobNode> nodes;

    public DockerRunResponse() {
        errors = new ArrayList<>();
        nodes = new ArrayList<>();
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

    public List<JobNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<JobNode> nodes) {
        this.nodes = nodes;
    }
}
