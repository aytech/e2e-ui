package com.idm.e2e.web.models;

public class DockerRunRequest {
    private String user;
    private String password;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEmailValid() {
        return user.matches("^\\w+\\.?\\w+@infor\\.com$");
    }
}
