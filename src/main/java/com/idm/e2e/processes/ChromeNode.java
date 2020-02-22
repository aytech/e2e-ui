package com.idm.e2e.processes;

import com.idm.e2e.entities.*;
import com.idm.e2e.resources.DockerCommandsResource;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Transactional
public class ChromeNode extends Node {

    private Process chromeProcess;
    private NodeEntity nodeEntity;
    protected String nodeID;
    private Boolean isFailed;

    public ChromeNode(UserEntity userEntity) {
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
        closeNode(nodeEntity);
    }

    @Override
    public void run() {
        try {
            System.out.println("Start Chrome");
            chromeProcess = DockerCommandsResource.runChromeNode(nodeID).start();
            log(chromeProcess, nodeEntity);
            chromeProcess.waitFor();
            System.out.println("End Chrome");
        } catch (IOException | InterruptedException e) {
            isFailed = true;
            e.printStackTrace();
        }
    }
}
