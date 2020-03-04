package com.idm.e2e.models;

public class BasicVariable {

    public enum DefaultVariableName {
        E2E_DOCUMENT_TYPE,
        E2E_ENVIRONMENT,
        E2E_FILE_PATH,
        E2E_USER,
        E2E_PASSWORD
    }
    public enum VariableType {
        EMAIL,
        PASSWORD,
        TEXT
    }

    private long id;
    private String key;
    private String value;
    private VariableType type;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public VariableType getType() {
        return type;
    }

    public void setType(VariableType type) {
        this.type = type;
    }
}
