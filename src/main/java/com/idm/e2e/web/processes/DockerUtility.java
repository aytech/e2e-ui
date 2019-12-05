package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.ProcessLogger;

import java.io.IOException;
import java.util.List;
import java.util.regex.Pattern;

import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_GRID_CONTAINER_NAME;
import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_STATUS_RUNNING;

public class DockerUtility {
    private String containerName;

    public DockerUtility(String containerName) {
        this.containerName = containerName;
    }

    public void startSeleniumGridContainer() {
        try {
            Process process = DockerCommands.getRunningStatus(DOCKER_GRID_CONTAINER_NAME).start();
            ProcessLogger logger = new ProcessLogger(process);
            if (!logger.getLogBoolean()) {
                prune();
                createNetwork();
                startContainer(DockerCommands.startSeleniumGrid(), containerName);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public Boolean isContainerRunning(String containerName) {
        try {
            Process process = DockerCommands.getContainerRunningStatus(containerName).start();
            ProcessLogger logger = new ProcessLogger(process);
            return logger.getLogString().equals(DOCKER_STATUS_RUNNING);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Boolean isContainerCreated() {
        try {
            Process process = DockerCommands.isContainerCreated(containerName).start();
            ProcessLogger logger = new ProcessLogger(process);
            return logger.getLogString() != null;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    private void prune() throws IOException, InterruptedException {
        Process process = DockerCommands.prune().start();
        ProcessLogger logger = new ProcessLogger(process);
        logger.log(null);
        process.waitFor();
    }

    private void createNetwork() throws IOException, InterruptedException {
        Process process = DockerCommands.networkCreate().start();
        ProcessLogger logger = new ProcessLogger(process);
        logger.log(null);
        process.waitFor();
    }

    public Process startContainer(ProcessBuilder builder, String logID) throws IOException, InterruptedException {
        Process process = builder.start();
        ProcessLogger logger = new ProcessLogger(process);
        logger.log(logID);
        process.waitFor();
        return process;
    }

    public Process startContainer(ProcessBuilder builder, String logID, Pattern pattern) throws IOException, InterruptedException {
        Process process = builder.start();
        ProcessLogger logger = new ProcessLogger(process);
        logger.log(logID, pattern);
        process.waitFor();
        return process;
    }

    public void stopRunningContainers(List<String> containerNames) {
        for (String containerName : containerNames) {
            try {
                if (isContainerRunning(containerName)) {
                    Process process = DockerCommands.getStopContainerCommand(containerName).start();
                    ProcessLogger logger = new ProcessLogger(process);
                    logger.log(containerName);
                    process.waitFor();
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
