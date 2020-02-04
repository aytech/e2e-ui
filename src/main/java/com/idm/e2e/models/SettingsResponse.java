package com.idm.e2e.models;

import java.util.*;

public class SettingsResponse {
    private List<BasicVariable> variables;

    public SettingsResponse() {
        this.variables = new ArrayList<>();
    }

    public List<BasicVariable> getVariables() {
        return variables;
    }

    public void setVariables(List<BasicVariable> variables) {
        this.variables = variables;
    }
}
