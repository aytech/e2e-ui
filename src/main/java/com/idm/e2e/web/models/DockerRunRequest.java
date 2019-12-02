package com.idm.e2e.web.models;

public class DockerRunRequest {
    private String email;
    private String password;
    private String branch;

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String user) {
        this.email = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEmailValid() {
        return email.matches("^\\w+\\.?\\w+@infor\\.com$");
    }
}
