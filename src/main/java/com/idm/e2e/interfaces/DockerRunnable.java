package com.idm.e2e.interfaces;

public interface DockerRunnable extends Runnable {
    Process getProcess();
    Boolean isAlive();
    Boolean isFailed();
    void destroy();
}
