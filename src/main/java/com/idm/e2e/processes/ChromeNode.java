package com.idm.e2e.processes;

import com.idm.e2e.data.FilesResource;
import com.idm.e2e.entities.*;
import com.idm.e2e.resources.DockerCommandsResource;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;

import static com.idm.e2e.configuration.DockerConstants.DOCKERFILE;

@Transactional
public class ChromeNode extends Node {

    private Process process;
    private Process chromeProcess;
    private Process e2eProcess;
    private NodeEntity nodeEntity;
    protected String nodeID;
    private Boolean isFailed;
    private Boolean isComplete;

    public ChromeNode(UserEntity userEntity) {
        isComplete = false;
        isFailed = false;
        nodeID = String.format("chrome_%s", DockerCommandsResource.getNewNodeID());
        nodeEntity = addNode(userEntity, nodeID);
    }

    @Override
    public Process getProcess() {
        return chromeProcess;
    }

    @Override
    public Boolean isAlive() {
        return isComplete;
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
        if (chromeProcess != null) {
            chromeProcess.destroy();
        }
        if (e2eProcess != null) {
            e2eProcess.destroy();
        }
        try {
            Process stopChromeProcess = DockerCommandsResource.getStopContainerCommand(nodeID).start();
            stopChromeProcess.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        } finally {
            closeNode(nodeEntity);
        }
    }

    @Override
    public void run() {
        try {
            // Write Dockerfile
            FilesResource filesResource = new FilesResource();
            filesResource.copyConfigurationFiles(nodeID);
            filesResource.writeDockerFile(DOCKERFILE, nodeID);
            // Build Docker image
            File dockerFile = filesResource.getDockerFile(nodeID);
            String tag = String.format("%s_suite", nodeID);
            process = DockerCommandsResource.buildImage(dockerFile.getAbsolutePath(), tag, dockerFile.getParent()).start();
            log(process, nodeEntity);
            process.waitFor();
            // Run Chrome
            chromeProcess = DockerCommandsResource.runChromeNode(nodeID).start();
            log(chromeProcess, nodeEntity);
            chromeProcess.waitFor();
            // Run tests suite from built image
            String reportsDirectory = filesResource.getNodeDirectory(nodeID).getPath();
            e2eProcess = DockerCommandsResource.runE2ENode(tag, reportsDirectory).start();
            log(e2eProcess, nodeEntity);
            e2eProcess.waitFor();
            isComplete = true;
        } catch (IOException | InterruptedException e) {
            isComplete = true;
            isFailed = true;
            e.printStackTrace();
        }
    }
}
