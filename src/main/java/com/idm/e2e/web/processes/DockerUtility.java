package com.idm.e2e.web.processes;

import com.idm.e2e.web.configuration.DockerCommands;
import com.idm.e2e.web.data.ProcessLogger;

import java.io.IOException;
import java.util.List;
import java.util.regex.Pattern;

public class DockerUtility {
    private String containerName;

    public DockerUtility(String containerName) {
        this.containerName = containerName;
    }

    public void startSeleniumGridContainer() {
        try {
            System.out.println(String.format("Container %s running: %b", containerName, isContainerRunning()));
            if (!isContainerRunning()) {
                prune();
                createNetwork();
                startContainer(DockerCommands.startSeleniumGrid(), containerName);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private Boolean isContainerRunning() throws IOException {
        Process process = DockerCommands.getRunningStatus(containerName).start();
        ProcessLogger logger = new ProcessLogger(process);
        return logger.getLogBoolean();
    }

    public Integer getContainerExitStatus() {
        try {
            Process process = DockerCommands.getContainerExitStatus(containerName).start();
            ProcessLogger logger = new ProcessLogger(process);
            return logger.getLogNumber();
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
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

    public void stopNodes(List<String> nodeIDs) {
        for (String nodeID : nodeIDs) {
            try {
                Process process = DockerCommands.getStopNodeProcess(nodeID).start();
                ProcessLogger logger = new ProcessLogger(process);
                logger.log(nodeID);
                process.waitFor();
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
