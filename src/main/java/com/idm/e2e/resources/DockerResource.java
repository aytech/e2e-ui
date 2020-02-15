package com.idm.e2e.resources;

import com.idm.e2e.loggers.ProcessLogger;

import java.io.IOException;
import java.util.List;

import static com.idm.e2e.configuration.DockerConstants.DOCKER_STATUS_RUNNING;

public class DockerResource {
    private String containerName;

    public DockerResource() {
    }

    public void setContainerName(String containerName) {
        this.containerName = containerName;
    }

    public void startSeleniumGridContainer() {
        try {
            Process process = DockerCommandsResource.getContainerRunningStatus(containerName).start();
            ProcessLogger logger = new ProcessLogger(process);
            if (!logger.getLogBoolean()) {
                prune();
                createNetwork();
                startContainer(DockerCommandsResource.startSeleniumGrid(), containerName);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public Boolean isContainerRunning(String containerName) {
        try {
            Process process = DockerCommandsResource.getContainerStatus(containerName).start();
            ProcessLogger logger = new ProcessLogger(process);
            return logger.getLogString().equals(DOCKER_STATUS_RUNNING);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public Boolean isContainerCreated() throws IOException {
        Process process = DockerCommandsResource.isContainerCreated(containerName).start();
        ProcessLogger logger = new ProcessLogger(process);
        return logger.getLogString() != null;
    }

    private void prune() throws IOException, InterruptedException {
        Process process = DockerCommandsResource.prune().start();
        ProcessLogger logger = new ProcessLogger(process);
        logger.log(null);
        process.waitFor();
    }

    private void createNetwork() throws IOException, InterruptedException {
        Process process = DockerCommandsResource.networkCreate().start();
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

    public Process startContainer(ProcessBuilder builder, String logID, Boolean withSort) throws IOException, InterruptedException {
        Process process = builder.start();
        ProcessLogger logger = new ProcessLogger(process);
        logger.log(logID, withSort);
        process.waitFor();
        return process;
    }

    public void stopRunningContainers(List<String> containerNames) {
        for (String containerName : containerNames) {
            try {
                if (isContainerRunning(containerName)) {
                    Process process = DockerCommandsResource.getStopContainerCommand(containerName).start();
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
