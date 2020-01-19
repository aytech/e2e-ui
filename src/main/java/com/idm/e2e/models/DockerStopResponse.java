package com.idm.e2e.models;

public class DockerStopResponse {
    private String nodeID;

    public DockerStopResponse(String nodeID) {
        this.nodeID = nodeID;
    }

    public String getNodeID() {
        return nodeID;
    }

    public void setNodeID(String nodeID) {
        this.nodeID = nodeID;
    }
}
