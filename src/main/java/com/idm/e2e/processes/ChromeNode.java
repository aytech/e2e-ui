package com.idm.e2e.processes;

import com.idm.e2e.data.FilesResource;
import com.idm.e2e.entities.*;
import com.idm.e2e.resources.DockerCommandsResource;
import org.hibernate.Session;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;

import static com.idm.e2e.configuration.AppConstants.NODE_E2E_SUFFIX;

@Transactional
public class ChromeNode extends Node {

    private Process process;
    private Process chromeProcess;
    private Process e2eProcess;
    private NodeEntity nodeEntity;
    protected String nodeId;
    private String e2eNodeTag;
    private FilesResource filesResource;
    private Boolean isFailed;
    private Boolean isAlive;

    public ChromeNode(UserEntity userEntity) {
        isAlive = true;
        isFailed = false;
        nodeId = String.format("chrome_%s", DockerCommandsResource.getNewNodeID());
        e2eNodeTag = String.format("%s%s", nodeId, NODE_E2E_SUFFIX);
        filesResource = new FilesResource(nodeId);
        nodeEntity = addNode(userEntity, nodeId);
    }

    @Override
    public Process getProcess() {
        return chromeProcess;
    }

    @Override
    public Boolean isAlive() {
        return isAlive;
    }

    @Override
    public Boolean isFailed() {
        return isFailed;
    }

    @Override
    public void destroy() {
        try {
            Process stopChromeProcess = DockerCommandsResource.getStopContainerCommand(nodeId).start();
            stopChromeProcess.waitFor();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        } finally {
            if (process != null) {
                process.destroy();
            }
            if (chromeProcess != null) {
                chromeProcess.destroy();
            }
            if (e2eProcess != null) {
                e2eProcess.destroy();
            }
            closeNode(nodeEntity);
        }
    }

    @Override
    public void run() {
        try {
            if (filesResource.writeDockerFile("master")) {
//                buildDockerImage();
//                runChromeNode();
//                runE2eNode();
                filesResource.removeDockerFile();
                filesResource.removeRsaFile();
            }
            Session session = getSession();

            isAlive = false;
        } catch (IOException e) {
            e.printStackTrace();
            isFailed = true;
            isAlive = false;
        }
    }

    private void buildDockerImage() throws IOException, InterruptedException {
        filesResource.copyRsaFile();
        File dockerFile = filesResource.getDockerFile();
        process = DockerCommandsResource.buildImage(
                dockerFile.getAbsolutePath(), e2eNodeTag, dockerFile.getParent()).start();
        log(process, nodeEntity);
        process.waitFor();
    }

    private void runChromeNode() throws IOException, InterruptedException {
        chromeProcess = DockerCommandsResource.runChromeNode(nodeId).start();
        log(chromeProcess, nodeEntity);
        chromeProcess.waitFor();
    }

    private void runE2eNode() throws IOException, InterruptedException {
        String reportsDirectory = filesResource.getNodeDirectory().getPath();
        e2eProcess = DockerCommandsResource.runE2ENode(e2eNodeTag, reportsDirectory).start();
        log(e2eProcess, nodeEntity);
        e2eProcess.waitFor();
    }
}
