package com.idm.e2e.models;

import java.util.*;

public class SettingsResponse {
    private List<BasicVariable> variables;
    private List<BasicVariable> systemVariables;
    private List<BasicNode> nodes;

    public SettingsResponse() {
        this.variables = new ArrayList<>();
    }

    public List<BasicVariable> getVariables() {
        return variables;
    }

    public void setVariables(List<BasicVariable> variables) {
        this.variables = variables;
    }

    public List<BasicVariable> getSystemVariables() {
        return systemVariables;
    }

    public void setSystemVariables(List<BasicVariable> systemVariables) {
        this.systemVariables = systemVariables;
    }

    public List<BasicNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<BasicNode> nodes) {
        this.nodes = nodes;
    }
}
