package com.idm.e2e.models;

import java.util.*;

public class SettingsResponse {
    private Map<String, String> variables;

    public SettingsResponse() {
        this.variables = new HashMap<>();
    }

    public Map<String, String> getVariables() {
        return variables;
    }

    public void setVariables(Map<String, String> variables) {
        this.variables = variables;
    }
}
