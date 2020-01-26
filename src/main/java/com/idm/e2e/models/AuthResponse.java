package com.idm.e2e.models;

import java.util.ArrayList;

public class AuthResponse {
    private ArrayList<String> errors;
    private BasicUser user;

    public AuthResponse() {
        this.errors = new ArrayList<>();
    }

    public ArrayList<String> getErrors() {
        return errors;
    }

    public void setErrors(ArrayList<String> errors) {
        this.errors = errors;
    }

    public void addError(String error) {
        errors.add(error);
    }

    public BasicUser getUser() {
        return user;
    }

    public void setUser(BasicUser user) {
        this.user = user;
    }
}
