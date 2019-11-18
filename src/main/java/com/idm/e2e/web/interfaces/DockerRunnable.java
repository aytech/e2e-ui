package com.idm.e2e.web.interfaces;

public interface DockerRunnable extends Runnable {
    Process getProcess();
    Boolean isAlive();
    void destroy();
}
