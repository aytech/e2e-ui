package com.idm.e2e.processes;

import com.idm.e2e.loggers.ProcessLogger;
import com.idm.e2e.resources.DockerCommandsResource;

import java.io.IOException;

import static com.idm.e2e.configuration.DockerConstants.SELENIUM_GRID_CONTAINER_NAME;

public class SeleniumGrid extends Node {

    private Process process;
    private Boolean isFailed;

    public SeleniumGrid() {
        isFailed = false;
    }

    @Override
    public Process getProcess() {
        return process;
    }

    @Override
    public Boolean isAlive() {
        System.out.println("GRID STATUS: " + (process != null && process.isAlive()));
        return process != null && process.isAlive();
    }

    @Override
    public Boolean isFailed() {
        return isFailed;
    }

    @Override
    public void destroy() {
        if (process != null) {
            process.destroy();
        }
    }

    @Override
    public void run() {
        try {
            process = DockerCommandsResource.getContainerRunningStatus(SELENIUM_GRID_CONTAINER_NAME).start();
            ProcessLogger logger = new ProcessLogger(process);
            if (!logger.getLogBoolean()) {
                process = DockerCommandsResource.prune().start();
                logSystem(process);
                process.waitFor();
                process = DockerCommandsResource.networkCreate().start();
                logSystem(process);
                process.waitFor();
                process = DockerCommandsResource.startSeleniumGrid().start();
                logSystem(process);
                process.waitFor();
            }
        } catch (IOException | InterruptedException e) {
            isFailed = true;
            e.printStackTrace();
        }
    }
}
