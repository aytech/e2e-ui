package com.idm.e2e.web.interfaces;

public interface DockerRunnable extends Runnable {
    Process getProcess();
    Boolean isAlive();
    Boolean isFailed();
    void destroy();
    void setNode(String node);
}
