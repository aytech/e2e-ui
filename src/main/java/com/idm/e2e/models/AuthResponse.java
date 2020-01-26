package com.idm.e2e.models;

import com.idm.e2e.entities.UserEntity;

import java.util.ArrayList;

public class AuthResponse {
    private ArrayList<String> errors;
    private UserEntity user;

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

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
