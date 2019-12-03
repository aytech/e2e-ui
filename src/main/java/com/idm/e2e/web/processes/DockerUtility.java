package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.ProcessLogger;

import java.io.IOException;
import java.util.regex.Pattern;

import static com.idm.e2e.web.configuration.DockerConstants.DOCKER_GRID_CONTAINER_NAME;

public class DockerUtility {
    public void startSeleniumGridContainer() {
        try {
            String container = DOCKER_GRID_CONTAINER_NAME;
            if (!isContainerRunning(container)) {
                prune();
                createNetwork();
                startContainer(DockerCommands.startSeleniumGrid(), container);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private Boolean isContainerRunning(String containerName) throws IOException {
        Process process = DockerCommands.getRunningStatus(containerName).start();
        ProcessLogger logger = new ProcessLogger(process);
        return logger.getLogBoolean();
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
}
