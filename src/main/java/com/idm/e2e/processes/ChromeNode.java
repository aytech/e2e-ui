package com.idm.e2e.processes;

import com.idm.e2e.data.FilesResource;
import com.idm.e2e.entities.*;
import com.idm.e2e.resources.DockerCommandsResource;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

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
        e2eNodeTag = String.format("%s_suite", nodeId);
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
        System.out.println("Destroy called");
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
                buildDockerImage();
                runChromeNode();
                runE2eNode();
                updateReportsDirectoryPermissions();
                filesResource.removeDockerFile();
                filesResource.removeRsaFile();
            }
            isAlive = false;
        } catch (IOException | InterruptedException e) {
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

    private void updateReportsDirectoryPermissions() {
        final Iterator<File> files = FileUtils.iterateFilesAndDirs(
                filesResource.getNodePath(),
                new WildcardFileFilter("*.*"),
                new WildcardFileFilter("*"));
        while (files.hasNext()) {
            File file = files.next();
            file.setReadable(true, false);
            file.setWritable(true, false);
            file.setExecutable(true, false);
        }
    }
}
