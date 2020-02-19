package com.idm.e2e.processes;

import com.idm.e2e.entities.NodeEntity;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.interfaces.DockerRunnable;
import com.idm.e2e.loggers.ProcessLogger;
import com.idm.e2e.repositories.UserRepository;
import com.idm.e2e.resources.DockerCommandsResource;
import com.idm.e2e.services.NodeService;

import java.io.IOException;

public class ChromeNode implements DockerRunnable {

    private Process chromeProcess;
    private NodeService nodeService;
    private UserEntity userEntity;
    private NodeEntity nodeEntity;
    protected String nodeID;
    private Boolean isFailed;

    public ChromeNode(NodeService nodeService, UserEntity userEntity) {
        isFailed = false;
        nodeID = DockerCommandsResource.getNewNodeID();
        this.nodeService = nodeService;
        this.userEntity = userEntity;
    }

    @Override
    public Process getProcess() {
        return chromeProcess;
    }

    @Override
    public Boolean isAlive() {
        System.out.println("CHROME alive: " + (chromeProcess != null && chromeProcess.isAlive()));
        return chromeProcess != null && chromeProcess.isAlive();
    }

    @Override
    public Boolean isFailed() {
        return isFailed;
    }

    @Override
    public void destroy() {
        if (chromeProcess != null) {
            chromeProcess.destroy();
        }
        nodeService.updateNodeStatus("complete", nodeEntity);
    }

    @Override
    public void run() {
        try {
            System.out.println("Start Chrome");
            String nodeTag = String.format("chrome_%s", nodeID);
            addNode(nodeTag);
            chromeProcess = DockerCommandsResource.runChromeNode(nodeTag).start();
            ProcessLogger chromeLogger = new ProcessLogger(chromeProcess);
            chromeLogger.log(nodeID);
            chromeProcess.waitFor();
            System.out.println("End Chrome");
        } catch (IOException | InterruptedException e) {
            isFailed = true;
            e.printStackTrace();
        }
    }

    private void addNode(String tag) {
        System.out.println("UserEntity: " + userEntity);
        NodeEntity nodeEntity = new NodeEntity();
        nodeEntity.setNode(tag);
        nodeEntity.setStatus("in progress");
        nodeEntity.setUser(userEntity);
        this.nodeEntity = nodeService.createNode(userEntity, nodeEntity);
    }
}
